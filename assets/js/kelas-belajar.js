const params = new URLSearchParams(location.search);
const classId = params.get("id");

let studentProfile = null;
let lessonCache = new Map();

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

  const quizStatusMap = new Map(
    (quizStatuses || []).map(status => [status.module_id, status])
  );

  const progressMap = new Map(
    progress.map(item => [item.lesson_id, item])
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
    <article class="learning-module kb-module">

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

function openLesson(lessonId) {
  const lesson = lessonCache.get(lessonId);
  if (!lesson) return;

  document.getElementById("lessonTitle").textContent = lesson.title;
  const metaParts = [];

  if (lesson.video_duration) {
    metaParts.push(`Video ${lesson.video_duration} menit`);
  }

  if (lesson.estimated_minutes) {
    metaParts.push(`Estimasi belajar ${lesson.estimated_minutes} menit`);
  }

  document.getElementById("lessonMeta").textContent =
    metaParts.join(" · ");

  renderLessonReaderPills(lesson);
  renderLessonVideo(lesson);

  const rawContent = lesson.content?.trim()
    ? lesson.content
    : "Resume materi belum diisi oleh pengajar.";

  let rendered = "";

  try {
    rendered = window.marked
      ? window.marked.parse(rawContent)
      : `<p>${escapeHtml(rawContent)}</p>`;

    if (window.DOMPurify) {
      rendered = window.DOMPurify.sanitize(rendered);
    }
  } catch (error) {
    rendered = `<p>${escapeHtml(rawContent)}</p>`;
  }

  document.getElementById("lessonContent").innerHTML = rendered;
  document.getElementById("completeLessonBtn").dataset.lessonId = lessonId;
  document.getElementById("lessonModal").showModal();
}

document.getElementById("lessonModal")
  ?.addEventListener("close", () => {
    const host = document.getElementById("lessonVideo");

    if (host) {
      host.innerHTML = "";
    }
  });


function renderLessonReaderPills(lesson) {
  const host =
    document.getElementById("lessonReaderPills");

  if (!host) {
    return;
  }

  const pills = [];

  if (lesson.video_url?.trim()) {
    pills.push({
      label: lesson.video_duration
        ? `Video ${lesson.video_duration} menit`
        : "Video pembelajaran",
      tone: "blue"
    });
  }

  if (lesson.estimated_minutes) {
    pills.push({
      label: `Belajar ± ${lesson.estimated_minutes} menit`,
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
      .map((pill) => `
        <span class="lesson-reader-pill ${pill.tone}">
          ${escapeHtml(pill.label)}
        </span>
      `)
      .join("");
}


function renderLessonVideo(lesson) {
  const section =
    document.getElementById("lessonVideoSection");

  const host =
    document.getElementById("lessonVideo");

  const duration =
    document.getElementById("lessonVideoDuration");

  if (!section || !host || !duration) {
    return;
  }

  host.innerHTML = "";
  duration.textContent = "";

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
    return;
  }

  const requestedOrientation =
    ["auto", "landscape", "portrait"].includes(lesson.video_orientation)
      ? lesson.video_orientation
      : "auto";

  const resolvedOrientation =
    requestedOrientation === "auto"
      ? inferVideoOrientation(rawUrl, video)
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

  if (video.type === "iframe") {
    const iframe =
      document.createElement("iframe");

    iframe.src = video.src;
    iframe.title = `Video pembelajaran: ${lesson.title}`;
    iframe.loading = "lazy";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy =
      "strict-origin-when-cross-origin";

    host.appendChild(iframe);
    return;
  }

  if (video.type === "video") {
    const player =
      document.createElement("video");

    player.src = video.src;
    player.controls = true;
    player.preload = "metadata";
    player.playsInline = true;

    host.appendChild(player);
    return;
  }

  const link =
    document.createElement("a");

  link.href = video.src;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.className = "lesson-video-external";
  link.textContent = "Buka video pembelajaran ↗";

  host.appendChild(link);
}


function inferVideoOrientation(rawUrl, video) {
  try {
    const url = new URL(rawUrl);

    if (
      /(^|\/)shorts(\/|$)/i.test(url.pathname)
    ) {
      return "portrait";
    }
  } catch (error) {
    // fallback landscape
  }

  return "landscape";
}

function getVideoConfig(value) {
  let url;

  try {
    url = new URL(value);
  } catch (error) {
    return null;
  }

  if (!["http:", "https:"].includes(url.protocol)) {
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
        .filter(Boolean)[0] || null;
  }

  if (
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "youtube-nocookie.com"
  ) {
    if (url.pathname === "/watch") {
      youtubeId =
        url.searchParams.get("v");
    } else {
      const parts =
        url.pathname
          .split("/")
          .filter(Boolean);

      if (
        ["embed", "shorts", "live"].includes(parts[0])
      ) {
        youtubeId =
          parts[1] || null;
      }
    }
  }

  if (
    youtubeId &&
    /^[A-Za-z0-9_-]{6,20}$/.test(youtubeId)
  ) {
    return {
      type: "iframe",
      src:
        `https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?rel=0&modestbranding=1`
    };
  }

  if (
    host === "vimeo.com" ||
    host === "player.vimeo.com"
  ) {
    const match =
      url.pathname.match(/(?:video\/)?(\d+)/);

    if (match) {
      return {
        type: "iframe",
        src:
          `https://player.vimeo.com/video/${match[1]}`
      };
    }
  }

  if (
    /\.(mp4|webm|ogg)$/i.test(url.pathname)
  ) {
    return {
      type: "video",
      src: url.href
    };
  }

  return {
    type: "external",
    src: url.href
  };
}


document.getElementById("completeLessonBtn")?.addEventListener("click", async (event) => {
  const lessonId = event.currentTarget.dataset.lessonId;
  if (!lessonId) return;

  const now = new Date().toISOString();

  const { error } = await window.kabayanSupabase
    .from("lesson_progress")
    .upsert({
      user_id: studentProfile.id,
      lesson_id: lessonId,
      status: "completed",
      started_at: now,
      completed_at: now
    }, {
      onConflict: "user_id,lesson_id"
    });

  if (error) {
    alert(error.message);
    return;
  }

  document.getElementById("lessonModal").close();
  await loadClassLearning();
});

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}
