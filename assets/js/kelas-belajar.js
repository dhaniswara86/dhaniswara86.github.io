const params = new URLSearchParams(location.search);
const classId = params.get("id");

let studentProfile = null;
let lessonCache = new Map();
let lessonProgressCache = new Map();
let lessonVideoProgressCache = new Map();

let currentLessonId = null;
let activeYouTubePlayer = null;
let activeVimeoPlayer = null;

let youtubeApiPromise = null;
let vimeoApiPromise = null;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    studentProfile = await window.KabayanAuth.requireRole("student");

    if (!classId) {
      location.replace("peserta-dashboard.html");
      return;
    }

    await loadClassLearning();
  } catch (error) {
    console.error(error);
  }
});

async function loadClassLearning() {
  const { data: cls, error: classError } = await window.kabayanSupabase
    .from("classes")
    .select("id, name, description, status")
    .eq("id", classId)
    .single();

  if (classError) throw classError;

  document.getElementById("className").textContent = cls.name;
  document.getElementById("classDescription").textContent = cls.description || "";

  const { data: modules, error } = await window.kabayanSupabase
    .from("modules")
    .select("id, title, description, position, module_type, lessons(id,title,content,video_url,video_duration,video_orientation,position,estimated_minutes,is_published)")
    .eq("class_id", classId)
    .eq("is_published", true)
    .eq("module_type", "learning")
    .order("position", { ascending: true });

  if (error) throw error;

  const publishedModules = (modules || []).map(module => ({
    ...module,
    lessons: (module.lessons || [])
      .filter(lesson => lesson.is_published)
      .sort((a, b) => a.position - b.position)
  }));

  lessonCache = new Map();
  publishedModules.forEach(module => {
    module.lessons.forEach(lesson => lessonCache.set(lesson.id, lesson));
  });

  const lessonIds = [...lessonCache.keys()];
  let progress = [];

  if (lessonIds.length) {
    const { data: rows, error: progressError } = await window.kabayanSupabase
      .from("lesson_progress")
      .select("lesson_id,status,completed_at")
      .in("lesson_id", lessonIds);

    if (progressError) throw progressError;
    progress = rows || [];
  }

  const { data: quizStatuses, error: quizStatusError } =
    await window.kabayanSupabase.rpc("get_class_quiz_statuses", {
      p_class_id: classId
    });

  if (quizStatusError) throw quizStatusError;

  const { data: finalRows, error: finalError } =
    await window.kabayanSupabase.rpc("get_final_evaluation_status", {
      p_class_id: classId
    });

  if (finalError) throw finalError;

  const finalStatus =
    Array.isArray(finalRows)
      ? (finalRows[0] || null)
      : finalRows;

  let activeCertificate = null;

  try {
    const { data: certificateRows, error: certificateError } =
      await window.kabayanSupabase.rpc("get_my_certificates");

    if (!certificateError) {
      const certificates =
        Array.isArray(certificateRows)
          ? certificateRows
          : [];

      activeCertificate =
        certificates.find(certificate =>
          String(certificate.class_id) === String(classId) &&
          certificate.status === "active"
        ) || null;
    }
  } catch (certificateLookupError) {
    console.warn(
      "Sertifikat belum dapat dibaca:",
      certificateLookupError
    );
  }

  const quizStatusMap = new Map(
    (quizStatuses || []).map(status => [status.module_id, status])
  );

  const progressMap = new Map(
    progress.map(item => [item.lesson_id, item])
  );

  lessonProgressCache = progressMap;

  let videoProgressRows = [];

  if (lessonIds.length) {
    const { data: watchedRows, error: watchedError } =
      await window.kabayanSupabase
        .from("lesson_video_progress")
        .select("lesson_id,completed_at")
        .in("lesson_id", lessonIds);

    if (watchedError) {
      console.warn(
        "Status video belum dapat dibaca:",
        watchedError.message
      );
    } else {
      videoProgressRows = watchedRows || [];
    }
  }

  lessonVideoProgressCache =
    new Map(
      videoProgressRows.map(row => [
        row.lesson_id,
        row
      ])
    );

  const allLessons = [...lessonCache.values()];
  const completed = allLessons.filter(
    lesson => progressMap.get(lesson.id)?.status === "completed"
  ).length;

  const percent = allLessons.length
    ? Math.round((completed / allLessons.length) * 100)
    : 0;

  document.getElementById("progressText").textContent =
    `${completed} dari ${allLessons.length} checkpoint selesai`;

  document.getElementById("progressPercent").textContent = `${percent}%`;
  document.getElementById("progressBar").style.width = `${percent}%`;

  const progressRing =
    document.getElementById("progressRing");

  if (progressRing) {
    progressRing.style.setProperty("--progress", percent);
  }

  const moduleCount =
    document.getElementById("moduleCount");

  const completedCount =
    document.getElementById("completedCount");

  const remainingCount =
    document.getElementById("remainingCount");

  if (moduleCount) {
    moduleCount.textContent = publishedModules.length;
  }

  if (completedCount) {
    completedCount.textContent = completed;
  }

  if (remainingCount) {
    remainingCount.textContent =
      Math.max(allLessons.length - completed, 0);
  }

  const quizRows =
    quizStatuses || [];

  const learningQuizRows =
    quizRows.filter(status =>
      status.module_id &&
      status.is_published !== false
    );

  const allLearningQuizzesPassed =
    learningQuizRows.length > 0 &&
    learningQuizRows.every(status => status.passed);

  const firstReadyQuiz =
    learningQuizRows.find(status =>
      !status.passed &&
      status.can_start
    ) || null;

  updateAdaptiveLearningState({
    completed,
    totalLessons: allLessons.length,
    percent,
    finalStatus,
    allLearningQuizzesPassed,
    firstReadyQuiz,
    activeCertificate
  });

  const host = document.getElementById("moduleList");

  if (!publishedModules.length) {
    host.innerHTML = `<div class="empty">Materi belum diterbitkan oleh pengajar.</div>`;
    return;
  }

  host.innerHTML =
    publishedModules
      .map(module =>
        renderLearningModule(
          module,
          progressMap,
          quizStatusMap.get(module.id)
        )
      )
      .join("") +
    renderFinalEvaluation(finalStatus);

  document.querySelectorAll(".checkpoint").forEach(button => {
    button.addEventListener("click", () => openLesson(button.dataset.lessonId));
  });
}

function updateAdaptiveLearningState({
  completed,
  totalLessons,
  percent,
  finalStatus,
  allLearningQuizzesPassed,
  firstReadyQuiz,
  activeCertificate
}) {
  const panel =
    document.querySelector(".kb-progress-panel");

  const badge =
    document.getElementById("progressBadge");

  const label =
    document.getElementById("progressStateLabel");

  const title =
    document.getElementById("progressStateTitle");

  const description =
    document.getElementById("progressStateDescription");

  const action =
    document.getElementById("progressStateAction");

  const remainingLabel =
    document.getElementById("remainingLabel");

  const remainingCount =
    document.getElementById("remainingCount");

  const remainingHint =
    document.getElementById("remainingHint");

  if (
    !panel ||
    !badge ||
    !label ||
    !title ||
    !description ||
    !action
  ) {
    return;
  }

  panel.classList.remove(
    "is-learning",
    "is-material-complete",
    "is-final-ready",
    "is-complete",
    "is-attention"
  );

  action.innerHTML = "";

  const allMaterialsComplete =
    totalLessons > 0 &&
    completed === totalLessons;

  if (finalStatus?.passed) {
    panel.classList.add("is-complete");

    badge.textContent = "Lulus";
    label.textContent = "Kelas selesai";
    title.textContent =
      "Seluruh pembelajaran telah diselesaikan.";

    description.textContent =
      `Evaluasi Akhir lulus dengan nilai terbaik ${finalStatus.best_score ?? 0}.`;

    if (activeCertificate?.verification_code) {
      action.innerHTML = `
        <a
          class="kb-state-button light"
          href="sertifikat.html?code=${encodeURIComponent(activeCertificate.verification_code)}">
          Lihat Sertifikat
          <span aria-hidden="true">→</span>
        </a>
      `;
    } else {
      action.innerHTML = `
        <a
          class="kb-state-button subtle"
          href="sertifikat-saya.html">
          Sertifikat Saya
          <span aria-hidden="true">→</span>
        </a>
      `;
    }

    if (remainingLabel) {
      remainingLabel.textContent = "Status";
    }

    if (remainingCount) {
      remainingCount.textContent = "Selesai";
      remainingCount.classList.add("is-word");
    }

    if (remainingHint) {
      remainingHint.textContent =
        `Final ${finalStatus.best_score ?? 0} · kelas tuntas`;
    }

    return;
  }

  if (
    finalStatus?.is_published &&
    finalStatus?.prerequisites_complete &&
    finalStatus?.can_start
  ) {
    panel.classList.add("is-final-ready");

    badge.textContent = "Final";
    label.textContent = "Tahap terakhir";
    title.textContent =
      "Saatnya mengerjakan Evaluasi Akhir.";

    description.textContent =
      "Seluruh prasyarat telah terpenuhi. Selesaikan evaluasi untuk menuntaskan kelas.";

    action.innerHTML = `
      <a
        class="kb-state-button light"
        href="kuis-modul.html?id=${encodeURIComponent(finalStatus.quiz_id)}&class_id=${encodeURIComponent(classId)}&final=1">
        Mulai Evaluasi Akhir
        <span aria-hidden="true">→</span>
      </a>
    `;

    if (remainingLabel) {
      remainingLabel.textContent = "Tahap";
    }

    if (remainingCount) {
      remainingCount.textContent = "Final";
      remainingCount.classList.add("is-word");
    }

    if (remainingHint) {
      remainingHint.textContent =
        "Evaluasi Akhir siap dikerjakan";
    }

    return;
  }

  if (
    finalStatus?.is_published &&
    finalStatus?.prerequisites_complete &&
    !finalStatus?.can_start &&
    !finalStatus?.passed
  ) {
    panel.classList.add("is-attention");

    badge.textContent = "Evaluasi";
    label.textContent = "Evaluasi Akhir";
    title.textContent =
      "Evaluasi membutuhkan tindak lanjut.";

    description.textContent =
      finalStatus.max_attempts
        ? `Percobaan ${finalStatus.attempts_used}/${finalStatus.max_attempts} telah digunakan.`
        : "Evaluasi Akhir belum dapat dilanjutkan.";

    if (remainingLabel) {
      remainingLabel.textContent = "Status";
    }

    if (remainingCount) {
      remainingCount.textContent = "Final";
      remainingCount.classList.add("is-word");
    }

    if (remainingHint) {
      remainingHint.textContent =
        "Hubungi pengajar bila diperlukan";
    }

    return;
  }

  if (allMaterialsComplete) {
    panel.classList.add("is-material-complete");

    badge.textContent =
      allLearningQuizzesPassed
        ? "Siap"
        : "Materi selesai";

    label.textContent =
      allLearningQuizzesPassed
        ? "Materi & kuis selesai"
        : "Checkpoint selesai";

    if (
      allLearningQuizzesPassed &&
      (!finalStatus || !finalStatus.is_published)
    ) {
      title.textContent =
        "Seluruh materi dan kuis telah selesai.";

      description.textContent =
        "Evaluasi Akhir belum tersedia. Tunggu pengajar menerbitkannya.";

      if (remainingLabel) {
        remainingLabel.textContent = "Status";
      }

      if (remainingCount) {
        remainingCount.textContent = "Menunggu";
        remainingCount.classList.add("is-word");
      }

      if (remainingHint) {
        remainingHint.textContent =
          "Evaluasi Akhir belum diterbitkan";
      }

      return;
    }

    title.textContent =
      "Seluruh checkpoint telah selesai.";

    description.textContent =
      "Selesaikan kuis modul yang belum lulus untuk membuka Evaluasi Akhir.";

    if (firstReadyQuiz) {
      action.innerHTML = `
        <a
          class="kb-state-button light"
          href="kuis-modul.html?id=${encodeURIComponent(firstReadyQuiz.quiz_id)}&class_id=${encodeURIComponent(classId)}">
          Lanjut Kuis Modul
          <span aria-hidden="true">→</span>
        </a>
      `;
    }

    if (remainingLabel) {
      remainingLabel.textContent = "Checkpoint";
    }

    if (remainingCount) {
      remainingCount.textContent = "Selesai";
      remainingCount.classList.add("is-word");
    }

    if (remainingHint) {
      remainingHint.textContent =
        "lanjutkan kuis modul";
    }

    return;
  }

  panel.classList.add("is-learning");

  badge.textContent = "Aktif";
  label.textContent = "Perjalanan belajar";
  title.textContent =
    "Lanjutkan dari checkpoint terakhir.";

  description.textContent =
    "Selesaikan materi dan kuis secara bertahap untuk membuka Evaluasi Akhir.";

  action.innerHTML = `
    <a
      class="kb-state-button light"
      href="#learningJourney">
      Lanjut Belajar
      <span aria-hidden="true">↓</span>
    </a>
  `;

  if (remainingLabel) {
    remainingLabel.textContent = "Tersisa";
  }

  if (remainingCount) {
    remainingCount.textContent =
      Math.max(totalLessons - completed, 0);

    remainingCount.classList.remove("is-word");
  }

  if (remainingHint) {
    remainingHint.textContent =
      "checkpoint berikutnya";
  }
}


function renderLearningModule(module, progressMap, quiz) {
  const completedLessons =
    module.lessons.filter(
      lesson =>
        progressMap.get(lesson.id)?.status === "completed"
    ).length;

  const totalLessons =
    module.lessons.length;

  const modulePercent =
    totalLessons
      ? Math.round(
          (completedLessons / totalLessons) * 100
        )
      : 0;

  let quizCard = "";

  if (quiz) {
    let state = "locked";
    let eyebrow = "Kuis Modul";
    let detail =
      `${quiz.question_count} soal · Nilai minimum ${quiz.pass_score}`;
    let action = "";

    if (quiz.passed) {
      state = "passed";
      eyebrow = "Kuis Selesai";
      detail =
        `Nilai terbaik ${quiz.best_score ?? 0} · Lulus`;

      action = `
        <span class="quiz-module-badge kb-quiz-badge success">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m5 12 4 4L19 6"></path>
          </svg>
          Lulus
        </span>`;
    } else if (!quiz.prerequisites_complete) {
      detail =
        `Selesaikan semua checkpoint terlebih dahulu · ${quiz.question_count} soal`;

      action = `
        <span class="quiz-module-badge kb-quiz-badge locked">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="5" y="10" width="14" height="10" rx="2"></rect>
            <path d="M8 10V7a4 4 0 0 1 8 0v3"></path>
          </svg>
          Terkunci
        </span>`;
    } else if (!quiz.can_start) {
      detail = quiz.max_attempts
        ? `Percobaan ${quiz.attempts_used}/${quiz.max_attempts} telah digunakan`
        : "Kuis belum dapat dimulai";

      action = `
        <span class="quiz-module-badge kb-quiz-badge locked">
          Tidak tersedia
        </span>`;
    } else {
      state = "ready";
      eyebrow =
        quiz.attempts_used > 0
          ? "Coba Lagi"
          : "Siap Dikerjakan";

      detail =
        `${quiz.question_count} soal · Nilai minimum ${quiz.pass_score}`;

      action = `
        <a
          class="kb-quiz-button"
          href="kuis-modul.html?id=${encodeURIComponent(quiz.quiz_id)}&class_id=${encodeURIComponent(classId)}">

          <span>
            ${quiz.attempts_used > 0 ? "Coba lagi" : "Mulai kuis"}
          </span>

          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14"></path>
            <path d="m14 7 5 5-5 5"></path>
          </svg>

        </a>`;
    }

    quizCard = `
      <div class="quiz-module-card kb-quiz-card ${state}">

        <div class="kb-quiz-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 4h14v16H5z"></path>
            <path d="m8 9 2 2 4-4"></path>
            <path d="M8 15h8"></path>
          </svg>
        </div>

        <div class="kb-quiz-copy">
          <div class="eyebrow">${eyebrow}</div>
          <strong>${escapeHtml(quiz.quiz_title)}</strong>
          <span>${escapeHtml(detail)}</span>
        </div>

        <div class="kb-quiz-action">
          ${action}
        </div>

      </div>`;
  }

  return `
    <article class="learning-module kb-module" id="module-${module.id}">

      <div class="kb-module-head">

        <div class="kb-module-number">
          ${module.position}
        </div>

        <div class="kb-module-title">

          <div class="kb-module-kicker">
            Modul ${module.position}
          </div>

          <h2>
            ${escapeHtml(module.title)}
          </h2>

          <p>
            ${escapeHtml(module.description || "")}
          </p>

        </div>


        <div class="kb-module-progress">

          <strong>
            ${completedLessons}/${totalLessons}
          </strong>

          <span>
            checkpoint selesai
          </span>

          <div class="kb-module-progress-track">
            <i style="width:${modulePercent}%"></i>
          </div>

        </div>

      </div>


      <div class="checkpoint-list kb-checkpoint-list">

        ${
          module.lessons.length
            ? module.lessons
                .map((lesson) => {
                  const done =
                    progressMap.get(lesson.id)?.status === "completed";

                  const hasVideo =
                    Boolean(lesson.video_url?.trim());

                  const contentType =
                    hasVideo
                      ? "Video + Resume"
                      : "Resume Materi";

                  return `
                    <button
                      class="checkpoint kb-checkpoint ${done ? "done" : ""}"
                      data-lesson-id="${lesson.id}">

                      <span class="checkpoint-index kb-checkpoint-index">

                        ${
                          done
                            ? `
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="m5 12 4 4L19 6"></path>
                              </svg>
                            `
                            : lesson.position
                        }

                      </span>


                      <span class="kb-checkpoint-copy">

                        <strong>
                          ${escapeHtml(lesson.title)}
                        </strong>

                        <small>
                          <span>
                            ${done ? "Selesai" : "Belum selesai"}
                          </span>

                          <i></i>

                          <span>
                            ${escapeHtml(contentType)}
                          </span>

                          ${
                            lesson.estimated_minutes
                              ? `
                                <i></i>
                                <span>
                                  ± ${lesson.estimated_minutes} menit
                                </span>
                              `
                              : ""
                          }
                        </small>

                      </span>


                      <span class="kb-checkpoint-type ${hasVideo ? "video" : "read"}">

                        ${
                          hasVideo
                            ? `
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <rect x="3" y="5" width="18" height="14" rx="3"></rect>
                                <path d="m10 9 5 3-5 3V9Z"></path>
                              </svg>
                            `
                            : `
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M5 3h10l4 4v14H5z"></path>
                                <path d="M15 3v5h5"></path>
                                <path d="M8 13h8"></path>
                                <path d="M8 17h6"></path>
                              </svg>
                            `
                        }

                      </span>


                      <span class="kb-checkpoint-arrow">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="m9 18 6-6-6-6"></path>
                        </svg>
                      </span>

                    </button>
                  `;
                })
                .join("")
            : `
              <div class="empty small kb-empty">
                Belum ada checkpoint yang diterbitkan.
              </div>
            `
        }

      </div>

      ${quizCard}

    </article>
  `;
}

function renderFinalEvaluation(status) {
  if (!status) {
    return `
      <section class="final-evaluation-card unavailable">
        <div class="final-evaluation-copy">
          <div class="final-evaluation-kicker">Evaluasi Akhir</div>
          <h2>Ujian komprehensif PPh Pasal 21</h2>
          <p>Evaluasi Akhir belum diterbitkan oleh pengajar.</p>
        </div>
        <span class="final-evaluation-status">Belum tersedia</span>
      </section>
    `;
  }

  let cardClass = "locked";
  let statusText = "Terkunci";
  let action = "";

  if (status.passed) {
    cardClass = "passed";
    statusText = "Lulus";

    action = `
      <div class="final-evaluation-score">
        <span>Nilai terbaik</span>
        <strong>${status.best_score ?? 0}</strong>
      </div>
    `;
  } else if (!status.is_published) {
    cardClass = "unavailable";
    statusText = "Belum diterbitkan";
  } else if (!status.prerequisites_complete) {
    statusText = "Luluskan Modul 1–6";
  } else if (status.can_start) {
    cardClass = "ready";
    statusText = status.attempts_used > 0
      ? "Percobaan terakhir"
      : "Siap dikerjakan";

    action = `
      <a
        class="btn final-evaluation-button"
        href="kuis-modul.html?id=${encodeURIComponent(status.quiz_id)}&class_id=${encodeURIComponent(classId)}&final=1">
        ${status.attempts_used > 0 ? "Coba lagi" : "Mulai Evaluasi Akhir"}
      </a>
    `;
  } else {
    statusText = status.max_attempts
      ? `Percobaan ${status.attempts_used}/${status.max_attempts}`
      : "Tidak tersedia";
  }

  return `
    <section class="final-evaluation-card ${cardClass}">
      <div class="final-evaluation-copy">
        <div class="final-evaluation-kicker">Evaluasi Akhir</div>

        <h2>
          ${escapeHtml(status.quiz_title || "Evaluasi Akhir — PPh Pasal 21")}
        </h2>

        <p>
          ${status.question_count} soal lintas Modul 1–6 ·
          Nilai minimum ${status.pass_score} ·
          Maksimal ${status.max_attempts ?? "∞"} percobaan.
        </p>

        ${!status.prerequisites_complete ? `
          <small>
            Evaluasi terbuka otomatis setelah seluruh Kuis Modul 1–6 dinyatakan lulus.
          </small>
        ` : ""}
      </div>

      <div class="final-evaluation-action">
        <span class="final-evaluation-status">${escapeHtml(statusText)}</span>
        ${action}
      </div>
    </section>
  `;
}

async function openLesson(lessonId) {
  const lesson =
    lessonCache.get(lessonId);

  if (!lesson) {
    return;
  }

  currentLessonId = lessonId;

  resetActiveVideoPlayers();

  const modal =
    document.getElementById("lessonModal");

  const completeButton =
    document.getElementById("completeLessonBtn");

  const completeText =
    document.getElementById("completeLessonBtnText");

  document.getElementById("lessonTitle").textContent =
    lesson.title;


  const metaParts = [];

  if (lesson.video_duration) {
    metaParts.push(
      `Video ${lesson.video_duration} menit`
    );
  }

  if (lesson.estimated_minutes) {
    metaParts.push(
      `Estimasi belajar ${lesson.estimated_minutes} menit`
    );
  }

  document.getElementById("lessonMeta").textContent =
    metaParts.join(" · ");


  renderLessonReaderPills(lesson);
  renderLessonResumeContent(lesson);


  completeButton.dataset.lessonId =
    lessonId;


  const lessonAlreadyCompleted =
    lessonProgressCache.get(lessonId)?.status ===
    "completed";

  const hasVideo =
    Boolean(
      lesson.video_url?.trim()
    );

  const videoAlreadyCompleted =
    lessonVideoProgressCache.has(lessonId);


  resetLessonGateUI({
    hasVideo,
    lessonAlreadyCompleted
  });


  modal.showModal();

  document.body.classList.add(
    "kb-reader-open"
  );


  if (!hasVideo) {
    unlockLessonResume({
      lesson,
      scrollToResume: false,
      videoWasRequired: false
    });

    if (lessonAlreadyCompleted) {
      setLessonAlreadyCompletedState();
    }

    return;
  }


  if (
    videoAlreadyCompleted ||
    lessonAlreadyCompleted
  ) {
    unlockLessonResume({
      lesson,
      scrollToResume: false,
      videoWasRequired: true
    });

    setVideoCompletedState({
      persisted: true
    });

    if (lessonAlreadyCompleted) {
      setLessonAlreadyCompletedState();
    }
  }


  await renderLessonVideo(lesson);
}


function renderLessonResumeContent(lesson) {
  const rawContent =
    lesson.content?.trim()
      ? lesson.content
      : "Resume materi belum diisi oleh pengajar.";

  let rendered = "";

  try {
    rendered =
      window.marked
        ? window.marked.parse(rawContent)
        : `<p>${escapeHtml(rawContent)}</p>`;

    if (window.DOMPurify) {
      rendered =
        window.DOMPurify.sanitize(
          rendered
        );
    }
  } catch (error) {
    rendered =
      `<p>${escapeHtml(rawContent)}</p>`;
  }

  document.getElementById(
    "lessonContent"
  ).innerHTML = rendered;
}


function resetLessonGateUI({
  hasVideo,
  lessonAlreadyCompleted
}) {
  const resume =
    document.getElementById(
      "lessonResumeSection"
    );

  const locked =
    document.getElementById(
      "lessonResumeLocked"
    );

  const footerDot =
    document.getElementById(
      "lessonFooterDot"
    );

  const footerStatus =
    document.getElementById(
      "lessonFooterStatus"
    );

  const completeButton =
    document.getElementById(
      "completeLessonBtn"
    );

  const completeText =
    document.getElementById(
      "completeLessonBtnText"
    );

  const stepVideo =
    document.getElementById(
      "lessonStepVideo"
    );

  const stepResume =
    document.getElementById(
      "lessonStepResume"
    );

  const stepComplete =
    document.getElementById(
      "lessonStepComplete"
    );

  const unsupported =
    document.getElementById(
      "lessonVideoUnsupported"
    );


  resume.hidden = true;
  locked.hidden = !hasVideo;
  unsupported.hidden = true;

  completeButton.disabled = true;

  footerDot.className =
    "kb-reader-footer-dot locked";

  footerStatus.textContent =
    hasVideo
      ? "Selesaikan video terlebih dahulu"
      : "Resume siap dibaca";

  completeText.textContent =
    hasVideo
      ? "Resume terkunci"
      : "Tandai selesai";

  setReaderStep(
    stepVideo,
    hasVideo ? "active" : "done"
  );

  setReaderStep(
    stepResume,
    hasVideo ? "locked" : "active"
  );

  setReaderStep(
    stepComplete,
    "locked"
  );


  if (lessonAlreadyCompleted) {
    completeButton.disabled = true;
    completeText.textContent =
      "Checkpoint selesai";

    footerDot.className =
      "kb-reader-footer-dot done";

    footerStatus.textContent =
      "Checkpoint telah diselesaikan";
  }
}


function setReaderStep(element, state) {
  if (!element) {
    return;
  }

  element.classList.remove(
    "active",
    "locked",
    "done"
  );

  element.classList.add(state);
}


function unlockLessonResume({
  lesson,
  scrollToResume = true,
  videoWasRequired = true
}) {
  const resume =
    document.getElementById(
      "lessonResumeSection"
    );

  const locked =
    document.getElementById(
      "lessonResumeLocked"
    );

  const completeButton =
    document.getElementById(
      "completeLessonBtn"
    );

  const completeText =
    document.getElementById(
      "completeLessonBtnText"
    );

  const footerDot =
    document.getElementById(
      "lessonFooterDot"
    );

  const footerStatus =
    document.getElementById(
      "lessonFooterStatus"
    );

  const stepVideo =
    document.getElementById(
      "lessonStepVideo"
    );

  const stepResume =
    document.getElementById(
      "lessonStepResume"
    );

  const stepComplete =
    document.getElementById(
      "lessonStepComplete"
    );

  locked.hidden = true;
  resume.hidden = false;


  if (videoWasRequired) {
    setReaderStep(
      stepVideo,
      "done"
    );
  }

  setReaderStep(
    stepResume,
    "active"
  );

  setReaderStep(
    stepComplete,
    "active"
  );


  if (
    lessonProgressCache.get(
      lesson.id
    )?.status === "completed"
  ) {
    setLessonAlreadyCompletedState();
  } else {
    completeButton.disabled = false;
    completeText.textContent =
      "Tandai checkpoint selesai";

    footerDot.className =
      "kb-reader-footer-dot ready";

    footerStatus.textContent =
      "Resume terbuka · checkpoint dapat diselesaikan";
  }


  if (scrollToResume) {
    window.setTimeout(() => {
      resume.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 260);
  }
}


function setLessonAlreadyCompletedState() {
  const completeButton =
    document.getElementById(
      "completeLessonBtn"
    );

  const completeText =
    document.getElementById(
      "completeLessonBtnText"
    );

  const footerDot =
    document.getElementById(
      "lessonFooterDot"
    );

  const footerStatus =
    document.getElementById(
      "lessonFooterStatus"
    );

  completeButton.disabled = true;
  completeText.textContent =
    "Checkpoint selesai";

  footerDot.className =
    "kb-reader-footer-dot done";

  footerStatus.textContent =
    "Checkpoint telah diselesaikan";

  setReaderStep(
    document.getElementById(
      "lessonStepVideo"
    ),
    "done"
  );

  setReaderStep(
    document.getElementById(
      "lessonStepResume"
    ),
    "done"
  );

  setReaderStep(
    document.getElementById(
      "lessonStepComplete"
    ),
    "done"
  );
}


function setVideoCompletedState({
  persisted = false
} = {}) {
  const gate =
    document.getElementById(
      "lessonVideoGateStatus"
    );

  if (!gate) {
    return;
  }

  gate.classList.add(
    "completed"
  );

  gate.innerHTML = `
    <span class="kb-video-gate-icon">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m5 12 4 4L19 6"></path>
      </svg>
    </span>

    <div>
      <strong>Video selesai</strong>
      <span>
        ${
          persisted
            ? "Video telah diselesaikan sebelumnya. Resume materi sudah terbuka."
            : "Resume materi telah dibuka. Lanjutkan ke bagian berikutnya."
        }
      </span>
    </div>
  `;
}


async function handleVideoCompleted(
  lessonId
) {
  if (
    !lessonId ||
    lessonVideoProgressCache.has(
      lessonId
    )
  ) {
    const lesson =
      lessonCache.get(lessonId);

    if (lesson) {
      setVideoCompletedState({
        persisted: true
      });

      unlockLessonResume({
        lesson,
        scrollToResume: true,
        videoWasRequired: true
      });
    }

    return;
  }


  const { data, error } =
    await window.kabayanSupabase.rpc(
      "mark_lesson_video_complete",
      {
        p_lesson_id: lessonId
      }
    );


  if (error) {
    console.error(error);

    const footerStatus =
      document.getElementById(
        "lessonFooterStatus"
      );

    footerStatus.textContent =
      "Video selesai, tetapi progres gagal disimpan. Coba lagi.";

    alert(
      "Video sudah selesai, tetapi progres belum dapat disimpan. Silakan periksa koneksi lalu putar ulang bagian akhir video."
    );

    return;
  }


  lessonVideoProgressCache.set(
    lessonId,
    {
      lesson_id: lessonId,
      completed_at:
        data || new Date().toISOString()
    }
  );


  setVideoCompletedState();


  const lesson =
    lessonCache.get(lessonId);

  if (lesson) {
    unlockLessonResume({
      lesson,
      scrollToResume: true,
      videoWasRequired: true
    });
  }
}


function renderLessonReaderPills(lesson) {
  const host =
    document.getElementById(
      "lessonReaderPills"
    );

  if (!host) {
    return;
  }

  const pills = [];

  if (lesson.video_url?.trim()) {
    pills.push({
      label:
        lesson.video_duration
          ? `Video ${lesson.video_duration} menit`
          : "Video pembelajaran",
      tone: "blue"
    });
  }

  if (lesson.estimated_minutes) {
    pills.push({
      label:
        `Belajar ± ${lesson.estimated_minutes} menit`,
      tone: "gray"
    });
  }

  if (lesson.content?.trim()) {
    pills.push({
      label: "Resume tersedia",
      tone: "green"
    });
  }

  host.innerHTML =
    pills
      .map(
        pill => `
          <span class="lesson-reader-pill ${pill.tone}">
            ${escapeHtml(pill.label)}
          </span>
        `
      )
      .join("");
}


async function renderLessonVideo(lesson) {
  const section =
    document.getElementById(
      "lessonVideoSection"
    );

  const host =
    document.getElementById(
      "lessonVideo"
    );

  const duration =
    document.getElementById(
      "lessonVideoDuration"
    );

  const unsupported =
    document.getElementById(
      "lessonVideoUnsupported"
    );

  if (
    !section ||
    !host ||
    !duration ||
    !unsupported
  ) {
    return;
  }

  host.innerHTML = "";
  duration.textContent = "";
  unsupported.hidden = true;

  const rawUrl =
    lesson.video_url?.trim();

  if (!rawUrl) {
    section.hidden = true;
    return;
  }


  const video =
    getVideoConfig(rawUrl);

  if (!video) {
    section.hidden = true;
    unsupported.hidden = false;
    return;
  }


  const requestedOrientation =
    [
      "auto",
      "landscape",
      "portrait"
    ].includes(
      lesson.video_orientation
    )
      ? lesson.video_orientation
      : "auto";

  const resolvedOrientation =
    requestedOrientation === "auto"
      ? inferVideoOrientation(
          rawUrl,
          video
        )
      : requestedOrientation;


  section.hidden = false;

  host.classList.remove(
    "is-landscape",
    "is-portrait"
  );

  host.classList.add(
    resolvedOrientation === "portrait"
      ? "is-portrait"
      : "is-landscape"
  );


  duration.textContent =
    lesson.video_duration
      ? `${lesson.video_duration} menit`
      : "";


  if (video.provider === "youtube") {
    try {
      const YT =
        await ensureYouTubeAPI();

      const playerHost =
        document.createElement("div");

      const playerId =
        `yt-${lesson.id}-${Date.now()}`;

      playerHost.id =
        playerId;

      host.appendChild(playerHost);


      activeYouTubePlayer =
        new YT.Player(
          playerId,
          {
            host:
              "https://www.youtube-nocookie.com",

            videoId:
              video.videoId,

            playerVars: {
              rel: 0,
              playsinline: 1,
              modestbranding: 1,
              origin:
                window.location.origin
            },

            events: {
              onStateChange(event) {
                if (
                  event.data ===
                  YT.PlayerState.ENDED
                ) {
                  handleVideoCompleted(
                    lesson.id
                  );
                }
              }
            }
          }
        );

      return;

    } catch (error) {
      console.error(
        "YouTube API gagal:",
        error
      );

      unsupported.hidden = false;
      return;
    }
  }


  if (video.provider === "vimeo") {
    try {
      await ensureVimeoAPI();

      const iframe =
        document.createElement("iframe");

      iframe.src = video.src;
      iframe.title =
        `Video pembelajaran: ${lesson.title}`;
      iframe.allow =
        "autoplay; fullscreen; picture-in-picture";
      iframe.allowFullscreen = true;

      host.appendChild(iframe);


      activeVimeoPlayer =
        new window.Vimeo.Player(
          iframe
        );

      activeVimeoPlayer.on(
        "ended",
        () => {
          handleVideoCompleted(
            lesson.id
          );
        }
      );

      return;

    } catch (error) {
      console.error(
        "Vimeo API gagal:",
        error
      );

      unsupported.hidden = false;
      return;
    }
  }


  if (video.provider === "direct") {
    const player =
      document.createElement("video");

    player.src =
      video.src;

    player.controls = true;
    player.preload = "metadata";
    player.playsInline = true;

    player.addEventListener(
      "ended",
      () => {
        handleVideoCompleted(
          lesson.id
        );
      },
      {
        once: true
      }
    );

    host.appendChild(player);
    return;
  }


  section.hidden = true;
  unsupported.hidden = false;
}


function getVideoConfig(value) {
  let url;

  try {
    url =
      new URL(value);
  } catch (error) {
    return null;
  }


  if (
    ![
      "http:",
      "https:"
    ].includes(url.protocol)
  ) {
    return null;
  }


  const host =
    url.hostname
      .replace(/^www\./, "")
      .toLowerCase();


  let youtubeId = null;

  if (host === "youtu.be") {
    youtubeId =
      url.pathname
        .split("/")
        .filter(Boolean)[0] ||
      null;
  }


  if (
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "youtube-nocookie.com"
  ) {
    if (
      url.pathname ===
      "/watch"
    ) {
      youtubeId =
        url.searchParams.get("v");
    } else {
      const parts =
        url.pathname
          .split("/")
          .filter(Boolean);

      if (
        [
          "embed",
          "shorts",
          "live"
        ].includes(parts[0])
      ) {
        youtubeId =
          parts[1] ||
          null;
      }
    }
  }


  if (
    youtubeId &&
    /^[A-Za-z0-9_-]{6,20}$/.test(
      youtubeId
    )
  ) {
    return {
      provider: "youtube",
      videoId: youtubeId
    };
  }


  if (
    host === "vimeo.com" ||
    host === "player.vimeo.com"
  ) {
    const match =
      url.pathname.match(
        /(?:video\/)?(\d+)/
      );

    if (match) {
      return {
        provider: "vimeo",
        src:
          `https://player.vimeo.com/video/${match[1]}`
      };
    }
  }


  if (
    /\.(mp4|webm|ogg)$/i.test(
      url.pathname
    )
  ) {
    return {
      provider: "direct",
      src: url.href
    };
  }


  return {
    provider: "unsupported",
    src: url.href
  };
}


function inferVideoOrientation(
  rawUrl,
  video
) {
  try {
    const url =
      new URL(rawUrl);

    if (
      /(^|\/)shorts(\/|$)/i.test(
        url.pathname
      )
    ) {
      return "portrait";
    }
  } catch (error) {
    // fallback landscape
  }

  return "landscape";
}


function ensureYouTubeAPI() {
  if (
    window.YT &&
    window.YT.Player
  ) {
    return Promise.resolve(
      window.YT
    );
  }


  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }


  youtubeApiPromise =
    new Promise(
      (
        resolve,
        reject
      ) => {
        const previousCallback =
          window.onYouTubeIframeAPIReady;


        window.onYouTubeIframeAPIReady =
          () => {
            if (
              typeof previousCallback ===
              "function"
            ) {
              try {
                previousCallback();
              } catch (error) {
                console.warn(error);
              }
            }

            resolve(
              window.YT
            );
          };


        let script =
          document.querySelector(
            'script[data-kabayan-youtube-api="1"]'
          );

        if (!script) {
          script =
            document.createElement(
              "script"
            );

          script.src =
            "https://www.youtube.com/iframe_api";

          script.async = true;

          script.dataset.kabayanYoutubeApi =
            "1";

          script.onerror =
            () => reject(
              new Error(
                "YouTube API gagal dimuat."
              )
            );

          document.head.appendChild(
            script
          );
        }
      }
    );


  return youtubeApiPromise;
}


function ensureVimeoAPI() {
  if (
    window.Vimeo &&
    window.Vimeo.Player
  ) {
    return Promise.resolve(
      window.Vimeo
    );
  }


  if (vimeoApiPromise) {
    return vimeoApiPromise;
  }


  vimeoApiPromise =
    new Promise(
      (
        resolve,
        reject
      ) => {
        const existing =
          document.querySelector(
            'script[data-kabayan-vimeo-api="1"]'
          );


        if (existing) {
          existing.addEventListener(
            "load",
            () => resolve(
              window.Vimeo
            ),
            {
              once: true
            }
          );

          existing.addEventListener(
            "error",
            () => reject(
              new Error(
                "Vimeo API gagal dimuat."
              )
            ),
            {
              once: true
            }
          );

          return;
        }


        const script =
          document.createElement(
            "script"
          );

        script.src =
          "https://player.vimeo.com/api/player.js";

        script.async = true;

        script.dataset.kabayanVimeoApi =
          "1";

        script.onload =
          () => resolve(
            window.Vimeo
          );

        script.onerror =
          () => reject(
            new Error(
              "Vimeo API gagal dimuat."
            )
          );

        document.head.appendChild(
          script
        );
      }
    );


  return vimeoApiPromise;
}


function resetActiveVideoPlayers() {
  if (
    activeYouTubePlayer &&
    typeof activeYouTubePlayer.destroy ===
      "function"
  ) {
    try {
      activeYouTubePlayer.destroy();
    } catch (error) {
      console.warn(error);
    }
  }

  activeYouTubePlayer = null;


  if (activeVimeoPlayer) {
    try {
      activeVimeoPlayer.unload();
    } catch (error) {
      console.warn(error);
    }
  }

  activeVimeoPlayer = null;


  const host =
    document.getElementById(
      "lessonVideo"
    );

  if (host) {
    host.innerHTML = "";
  }
}


function closeLessonReader() {
  const modal =
    document.getElementById(
      "lessonModal"
    );

  resetActiveVideoPlayers();

  document.body.classList.remove(
    "kb-reader-open"
  );

  if (
    modal &&
    modal.open
  ) {
    modal.close();
  }

  currentLessonId = null;
}


document.getElementById(
  "closeLessonReaderBtn"
)?.addEventListener(
  "click",
  closeLessonReader
);


document.getElementById(
  "closeLessonReaderFooterBtn"
)?.addEventListener(
  "click",
  closeLessonReader
);


document.getElementById(
  "lessonModal"
)?.addEventListener(
  "cancel",
  event => {
    event.preventDefault();
    closeLessonReader();
  }
);


document.getElementById(
  "lessonModal"
)?.addEventListener(
  "close",
  () => {
    resetActiveVideoPlayers();

    document.body.classList.remove(
      "kb-reader-open"
    );
  }
);


document.getElementById(
  "completeLessonBtn"
)?.addEventListener(
  "click",
  async event => {
    const button =
      event.currentTarget;

    const lessonId =
      button.dataset.lessonId;

    if (
      !lessonId ||
      button.disabled
    ) {
      return;
    }


    button.disabled = true;

    const text =
      document.getElementById(
        "completeLessonBtnText"
      );

    const previousText =
      text.textContent;

    text.textContent =
      "Menyimpan…";


    const { data, error } =
      await window.kabayanSupabase.rpc(
        "complete_lesson_checkpoint",
        {
          p_lesson_id:
            lessonId
        }
      );


    if (error) {
      console.error(error);

      button.disabled = false;
      text.textContent =
        previousText;

      alert(
        error.message
      );

      return;
    }


    lessonProgressCache.set(
      lessonId,
      {
        lesson_id: lessonId,
        status: "completed",
        completed_at:
          data || new Date().toISOString()
      }
    );


    setLessonAlreadyCompletedState();

    window.setTimeout(
      async () => {
        closeLessonReader();
        await loadClassLearning();
      },
      500
    );
  }
);

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}
