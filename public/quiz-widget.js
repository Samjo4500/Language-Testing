/**
 * TestCEFR Embeddable Quiz Widget
 * 
 * Usage: Place this script on your page along with a <div id="testcefr-quiz">
 * The widget will render an interactive English quiz inside that div.
 * 
 * Options (data attributes on the div):
 *   data-count="5"    — number of questions (1-10)
 *   data-level="b2"   — CEFR level filter (a1, a2, b1, b2, c1, c2)
 * 
 * © TestCEFR — https://testcefr.com
 */
(function () {
  'use strict';

  var container = document.getElementById('testcefr-quiz');
  if (!container) {
    console.warn('[TestCEFR] No element with id="testcefr-quiz" found.');
    return;
  }

  var count = parseInt(container.getAttribute('data-count') || '5', 10);
  var level = container.getAttribute('data-level') || '';
  count = Math.min(Math.max(count, 1), 10);

  var API_URL = 'https://testcefr.com/api/quiz-widget?count=' + count;
  if (level) API_URL += '&level=' + encodeURIComponent(level.toLowerCase());

  // State
  var questions = [];
  var currentQ = 0;
  var score = 0;
  var answered = false;

  // Styles
  var styles = document.createElement('style');
  styles.textContent = [
    '#testcefr-quiz{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;max-width:520px;margin:0 auto;background:linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02));border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:24px;color:#e2e8f0;box-shadow:0 8px 32px rgba(0,0,0,0.3)}',
    '#testcefr-quiz *{box-sizing:border-box}',
    '.tq-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}',
    '.tq-brand{font-size:13px;color:#60a5fa;text-decoration:none;font-weight:600}',
    '.tq-brand:hover{color:#93c5fd}',
    '.tq-progress{font-size:11px;color:rgba(255,255,255,0.4)}',
    '.tq-level{display:inline-block;font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;background:rgba(59,130,246,0.15);color:#60a5fa;text-transform:uppercase;margin-bottom:8px}',
    '.tq-question{font-size:16px;font-weight:600;color:#fff;line-height:1.5;margin-bottom:16px}',
    '.tq-options{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}',
    '.tq-option{display:block;width:100%;text-align:left;padding:10px 14px;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);font-size:14px;cursor:pointer;transition:all 0.2s}',
    '.tq-option:hover{background:rgba(59,130,246,0.1);border-color:rgba(59,130,246,0.3);color:#fff}',
    '.tq-option.tq-correct{background:rgba(16,185,129,0.15);border-color:rgba(16,185,129,0.4);color:#6ee7b7}',
    '.tq-option.tq-wrong{background:rgba(239,68,68,0.1);border-color:rgba(239,68,68,0.3);color:#fca5a5}',
    '.tq-option.tq-disabled{pointer-events:none;opacity:0.5}',
    '.tq-explanation{font-size:13px;color:rgba(255,255,255,0.5);line-height:1.6;padding:12px;border-radius:8px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);margin-bottom:16px;display:none}',
    '.tq-explanation.tq-show{display:block}',
    '.tq-btn{display:inline-block;padding:10px 20px;border-radius:10px;font-size:14px;font-weight:500;cursor:pointer;border:none;transition:all 0.2s}',
    '.tq-btn-next{background:linear-gradient(to right,#2563eb,#06b6d4);color:#fff;box-shadow:0 4px 12px rgba(59,130,246,0.25)}',
    '.tq-btn-next:hover{box-shadow:0 6px 16px rgba(59,130,246,0.35);transform:translateY(-1px)}',
    '.tq-cta{display:block;text-align:center;padding:16px;border-radius:12px;background:linear-gradient(to right,#2563eb,#06b6d4);color:#fff;font-size:15px;font-weight:600;text-decoration:none;transition:all 0.2s;box-shadow:0 4px 16px rgba(59,130,246,0.3)}',
    '.tq-cta:hover{box-shadow:0 6px 20px rgba(59,130,246,0.4);transform:translateY(-2px)}',
    '.tq-footer{text-align:center;margin-top:12px;font-size:11px;color:rgba(255,255,255,0.25)}',
    '.tq-footer a{color:rgba(96,165,250,0.5);text-decoration:none}',
    '.tq-footer a:hover{color:#60a5fa}',
    '.tq-loading{text-align:center;padding:32px;color:rgba(255,255,255,0.3);font-size:14px}',
  ].join('\n');
  document.head.appendChild(styles);

  function render() {
    if (currentQ >= questions.length) {
      renderResults();
      return;
    }
    var q = questions[currentQ];
    answered = false;

    container.innerHTML =
      '<div class="tq-header">' +
        '<a href="https://testcefr.com" target="_blank" rel="noopener" class="tq-brand">TestCEFR</a>' +
        '<span class="tq-progress">Question ' + (currentQ + 1) + ' of ' + questions.length + '</span>' +
      '</div>' +
      '<div class="tq-level">' + q.level + ' · ' + q.skill + '</div>' +
      '<div class="tq-question">' + escapeHtml(q.question) + '</div>' +
      '<div class="tq-options" id="tq-options">' +
        q.options.map(function (opt, i) {
          return '<button class="tq-option" data-idx="' + i + '">' + escapeHtml(opt) + '</button>';
        }).join('') +
      '</div>' +
      '<div class="tq-explanation" id="tq-explanation">' + escapeHtml(q.explanation) + '</div>' +
      '<div id="tq-action" style="display:none;text-align:right"></div>' +
      '<div class="tq-footer"><a href="https://testcefr.com" target="_blank" rel="noopener">Free English Level Test →</a></div>';

    // Bind option clicks
    var optionsEl = document.getElementById('tq-options');
    optionsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.tq-option');
      if (!btn || answered) return;
      answered = true;
      var idx = parseInt(btn.getAttribute('data-idx'), 10);
      var correct = q.correctIndex;

      if (idx === correct) {
        score++;
        btn.classList.add('tq-correct');
      } else {
        btn.classList.add('tq-wrong');
        // Highlight correct
        var allBtns = optionsEl.querySelectorAll('.tq-option');
        if (allBtns[correct]) allBtns[correct].classList.add('tq-correct');
      }

      // Disable all
      optionsEl.querySelectorAll('.tq-option').forEach(function (b) {
        if (!b.classList.contains('tq-correct') && !b.classList.contains('tq-wrong')) {
          b.classList.add('tq-disabled');
        }
      });

      // Show explanation
      document.getElementById('tq-explanation').classList.add('tq-show');

      // Show next button
      var actionEl = document.getElementById('tq-action');
      actionEl.style.display = 'block';
      actionEl.innerHTML = '<button class="tq-btn tq-btn-next" id="tq-next">' +
        (currentQ < questions.length - 1 ? 'Next Question →' : 'See Results →') +
      '</button>';
      document.getElementById('tq-next').addEventListener('click', function () {
        currentQ++;
        render();
      });
    });
  }

  function renderResults() {
    var pct = Math.round((score / questions.length) * 100);
    var levelEstimate = pct >= 80 ? 'B2+' : pct >= 60 ? 'B1+' : pct >= 40 ? 'A2+' : 'A1-A2';

    container.innerHTML =
      '<div class="tq-header">' +
        '<a href="https://testcefr.com" target="_blank" rel="noopener" class="tq-brand">TestCEFR</a>' +
        '<span class="tq-progress">Quiz Complete</span>' +
      '</div>' +
      '<div style="text-align:center;margin-bottom:16px">' +
        '<div style="font-size:48px;font-weight:700;color:#fff;margin-bottom:4px">' + score + '/' + questions.length + '</div>' +
        '<div style="font-size:14px;color:rgba(255,255,255,0.5)">Estimated Level: <strong style="color:#60a5fa">' + levelEstimate + '</strong></div>' +
      '</div>' +
      '<p style="font-size:13px;color:rgba(255,255,255,0.4);text-align:center;margin-bottom:16px;line-height:1.6">' +
        'This mini-quiz gives a rough estimate. For an accurate, verified CEFR score across all 6 skills, take the full assessment.' +
      '</p>' +
      '<a href="https://testcefr.com/register" target="_blank" rel="noopener" class="tq-cta">Get Your Free CEFR Score →</a>' +
      '<div class="tq-footer"><a href="https://testcefr.com" target="_blank" rel="noopener">Powered by TestCEFR</a></div>';
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // Fetch and start
  container.innerHTML = '<div class="tq-loading">Loading quiz...</div>';

  fetch(API_URL)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.questions && data.questions.length > 0) {
        questions = data.questions;
        render();
      } else {
        container.innerHTML = '<div class="tq-loading">No questions available. Please try again.</div>';
      }
    })
    .catch(function () {
      container.innerHTML = '<div class="tq-loading">Unable to load quiz. Please check your connection.</div>';
    });
})();
