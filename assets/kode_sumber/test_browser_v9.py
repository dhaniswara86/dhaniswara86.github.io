from pathlib import Path
import base64
from playwright.sync_api import sync_playwright
out=Path('/mnt/data/psa_v9');out.mkdir(exist_ok=True)
html=Path('/mnt/data/Kabayan_PSA_Navigator_Formulir_Adaptif_v9.html').read_text()
for name,mime in [('LogoASD.svg','image/svg+xml'),('kabayan-kalkulator.webp','image/webp')]:
 b=Path('/mnt/data/assets/img/'+name).read_bytes()
 html=html.replace('assets/img/'+name,'data:'+mime+';base64,'+base64.b64encode(b).decode())

def step(page,n):
 assert page.locator('#step-label').inner_text().startswith('LANGKAH '+str(n)),page.locator('#step-label').inner_text()

def stage_to_details(page, entry, article, issue, origin=None):
 page.locator(f'[data-entry="{entry}"]').click();page.locator('#next').click();step(page,2)
 if page.locator('#f_routeDoc').count() and entry=='skp':page.locator('#f_routeDoc').select_option('SKPKB')
 if page.locator('#f_routeArticle').count():page.locator('#f_routeArticle').select_option(article)
 if page.locator('#f_routeIssueDate').count():page.locator('#f_routeIssueDate').fill(issue)
 if origin is not None:page.locator('#f_routeOrigin').select_option(origin)
 page.locator('#next').click();step(page,3)

with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,typ in [(1440,'desktop'),(390,'mobile')]:
  def make_page():
   p=browser.new_page(viewport={'width':width,'height':900},device_scale_factor=1)
   p.set_default_timeout(4500);p.set_content(html, wait_until='domcontentloaded',timeout=12000)
   errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
   return p,errors
  page,errs=make_page()
  assert page.locator('.brand-logo').evaluate('e=>e.naturalWidth')>0
  stage_to_details(page,'stp','14_4','2026-10-12','normal')
  page.locator('#f_principalConfirmed').select_option('no_base')
  page.locator('#f_sanctionState').select_option('partial')
  assert page.locator('input[name="paymentPath"]').count()==3
  page.locator('#loadPaymentDemo').click()
  assert page.locator('#payment-balance-number').inner_text()=='Rp90.000.000'
  assert page.locator('#f_sanctionPrior').input_value()=='10.000.000'
  assert page.locator('input[name="paymentPath"][value="no"]').is_checked()
  assert page.locator('#f_sanctionProgram').count()==0
  assert page.locator('#f_partialDate').count()==0
  page.locator('#f_sanctionPrior').fill('12000000')
  assert page.locator('#payment-balance-number').inner_text()=='Rp88.000.000'
  page.locator('#f_sanctionPrior').fill('10000000')
  page.screenshot(path=str(out/f'{typ}_form_simple.png'),full_page=False)
  page.locator('#next').click();step(page,4)
  page.locator('#f_stpLinked').select_option('no');page.locator('#f_otherRemedy').select_option('none');page.locator('#f_lawsuit').select_option('none');page.locator('#f_auctionCondition').select_option('no');page.locator('#f_applicationDate').fill('2027-01-10');page.locator('#f_submissionCount').select_option('1');page.locator('#f_docReady').select_option('yes')
  for k in ['docApplication','docAffidavit','docLegalStatement']:page.locator('#f_'+k).select_option('yes')
  page.locator('#next').click();step(page,5)
  assert page.locator('.res-head .rate').count()==0
  assert any(x in page.locator('.res-head').inner_text() for x in ['Perlu verifikasi','Informasi belum lengkap','Tidak dapat ditentukan'])
  page.screenshot(path=str(out/f'{typ}_review.png'),full_page=False)
  page.locator('#back').click();page.locator('#back').click();step(page,3)
  page.locator('input[name="paymentPath"][value="yes"]').check()
  assert page.locator('#f_sanctionProgram').count()==1
  page.locator('#f_sanctionProgram').fill('9000000')
  assert page.locator('#balance-after-special-value').inner_text()=='Rp81.000.000'
  assert page.locator('#balance-after-special').is_visible()
  page.locator('#f_partialDate').fill('2026-12-31')
  page.locator('input[name="allocationConfirmed"][value="yes"]').check()
  page.locator('#next').click();page.locator('#next').click();step(page,5)
  assert '90%' in page.locator('.res-head').inner_text(),page.locator('.res-head').inner_text()
  assert errs==[],errs
  page.close()

  # STP Pasal 14(3) should NEVER ask about special 10%/25%, but still ask prior payment and compute balance.
  page,errs=make_page();stage_to_details(page,'stp','14_3','2026-10-12')
  page.locator('#f_principalConfirmed').select_option('yes')
  page.locator('#f_principalDate').fill('2026-11-01')
  page.locator('#f_sanctionState').select_option('partial')
  assert page.locator('input[name="paymentPath"]').count()==0,'irrelevant program inputs present for STP Pasal 14(3)'
  page.locator('#f_sanctionTotal').fill('100000000');page.locator('#f_sanctionPrior').fill('10000000')
  assert page.locator('#payment-balance-number').inner_text()=='Rp90.000.000'
  assert page.locator('input[name="allocationConfirmed"]').count()==3
  assert errs==[],errs
  page.close()

  # SKPKB ordinary audit - special program never appears.
  page,errs=make_page();stage_to_details(page,'skp','13_2','2026-10-12','normal')
  page.locator('#f_principalConfirmed').select_option('yes');page.locator('#f_principalDate').fill('2026-11-01')
  page.locator('#f_sanctionState').select_option('partial')
  assert page.locator('input[name="paymentPath"]').count()==0,'irrelevant program inputs present for SKPKB audit'
  assert errs==[],errs
  page.close()

  # New STP Pasal 19(1): dates before START -> special branch; date in program -> no special branch.
  page,errs=make_page();stage_to_details(page,'stp','19_1','2026-10-12')
  page.locator('#f_principalConfirmed').select_option('yes');page.locator('#f_principalDate').fill('2026-07-07')
  page.locator('#f_sanctionState').select_option('partial')
  assert page.locator('input[name="paymentPath"]').count()==3,'expected program branch for paid principal before program'
  page.locator('#f_principalDate').fill('2026-11-01')
  assert page.locator('input[name="paymentPath"]').count()==0,'branch should disappear after correcting principal date'
  assert errs==[],errs
  page.close()
  print(f'{typ}: PASS STP14(4) 90%; STP14(3) no special; audit SKP no special; STP19 date-dependent branch; amount live; review on unknown')
 browser.close()
