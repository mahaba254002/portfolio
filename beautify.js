// ====== UTILITIES ======
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));


// Year
$('#year').textContent = new Date().getFullYear();


// ====== TOP NAV: hide on scroll down, show on scroll up ======
(function () {
  const header = document.querySelector('.top-nav');
  let lastY = window.scrollY;
  function onScroll() {
    const y = window.scrollY;
    if (y > lastY + 6) {
      header.classList.add('hidden');
    } else if (y < lastY - 6) {
      header.classList.remove('hidden');
    }
    lastY = y;
  }
  document.addEventListener('scroll', onScroll, { passive: true });
})();


// Smooth scroll for header links
$$('[data-nav]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ====== THEME TOGGLE ======
const body = document.body;
$('#toggleTheme').addEventListener('click', () => {
  body.classList.toggle('theme-light');
  body.classList.toggle('theme-dark');
});


// ====== COUNTER ANIMATIONS (IntersectionObserver) ======
(function () {
  const counters = $$('.stat-value');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const to = parseInt(el.getAttribute('data-count-to'), 10) || 0;
        let n = 0; const steps = 30; const dur = 600; const inc = to / steps; const dt = dur / steps;
        const t = setInterval(() => {
          n += inc; el.textContent = Math.round(n);
          if (n >= to) { el.textContent = to; clearInterval(t); }
        }, dt);
        obs.unobserve(el);
      }
    });
  }, { threshold: .4 });
  counters.forEach(c => obs.observe(c));
})();


// ====== MODALS ======
(function () {
  const modals = {
    useTemplate: $('#modal-useTemplate'),
    moreOptions: $('#modal-moreOptions'),
    tools: $('#modal-tools')
  };
  $$('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-modal-open');
      const m = modals[key];
      if (m) m.hidden = false;
    });
  });
  $$('[data-modal-close]').forEach(btn => btn.addEventListener('click', () => btn.closest('.modal').hidden = true));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') $$('.modal').forEach(m => m.hidden = true); });
  $$('.modal').forEach(m => m.addEventListener('click', e => { if (e.target === m) m.hidden = true; }));
})();


// ====== MORE OPTIONS toggles ======
$('#compactModeToggle')?.addEventListener('click', () => document.body.classList.toggle('compact'));
$('#roundedToggle')?.addEventListener('click', () => document.body.classList.toggle('extra-rounded'));
$('#highContrastToggle')?.addEventListener('click', () => document.body.classList.toggle('high-contrast'));


// ====== PROJECT DETAILS MODAL ======
const projectsData = [
  {
    title: "Automated Data Entry System",
    desc: "A streamlined automation solution that fetches data from Excel sheets, performs preprocessing and data wrangling, and automatically fills the data into the client platform. Designed to eliminate repetitive manual input, reduce errors, and improve workflow efficiency through intelligent form handling.",
    tags: ["Data Entry", "Automation", "Data Wrangling"],
    video: "assets/QA_evaluation.mp4",
    github: "https://github.com/mahaba95/DataAutomation"
  },
  {
    title: "RasaVision: Malaysian Food Recognition System",
    desc: "An intelligent food recognition system that identifies 17 traditional Malaysian dishes in real-time. Leveraging YOLO models, it provides fast and accurate classification for cultural food identification.",
    tags: ["Roboflow", "Python", "YoloV12", "YoloV11", "PyTorch"],
    video: "assets/Demo_Malaysian_Food_Detection.mp4",
    github: "https://github.com/mahaba254002/RasaVIsion---Malaysian-Food-Recognition-System"
  },
  {
    title: "Road Accident Dashboard and Analysis",
    desc: "A comprehensive data visualization project focused on transforming complex road accident datasets into actionable insights. Using Microsoft Excel's advanced features, I developed interactive dashboards that highlight critical trends and patterns, enabling data-driven decision-making through clear, aesthetic, and highly accurate visual storytelling.",
    tags: ["Excel", "Data Visualization", "Data Analysis", "Dashboards"],
    video: "assets/roadAccident.png",
    github: "https://github.com/mahaba254002/Data-visualization-with-Excel"
  },
  {
    title: "Watchify - AI Movie Recommendation System",
    desc: "A full-stack content recommendation platform powered by machine learning. Built with Next.js and TypeScript frontend featuring a modern glassmorphic UI, and a FastAPI Python backend utilizing content-based filtering algorithms. The system computes cosine similarity across movie plots, genres, and cast data using Scikit-learn and Pandas to deliver precise, personalized recommendations. Features include real-time search, responsive design, and an immersive media browsing interface.",
    tags: ["Next.js", "TypeScript", "Python", "FastAPI", "Scikit-learn", "Pandas", "Machine Learning"],
    video: "assets/movie recommendation.mp4",
    github: "https://github.com/mahaba254002/Watchify"
  }
];

const projModal = $('#modal-project-details');
const pDisplayTitle = $('#proj-title-display');
const pDisplayDesc = $('#proj-desc-display');
const pDisplayTags = $('#proj-tags-display');
const pVideo = $('#proj-video-container');
const pGithub = $('#proj-github-container');

$$('.proj-item').forEach((item, index) => {
  item.addEventListener('click', (e) => {
    // Prevent if clicking the direct link button (optional, but good UX)
    if (e.target.closest('.proj-link')) return;

    const data = projectsData[index] || { title: "Project Details", desc: "No details available.", tags: [], video: "", github: "" };

    // Populate
    pDisplayTitle.textContent = data.title;
    pDisplayDesc.textContent = data.desc;

    // Tags
    pDisplayTags.innerHTML = data.tags.map(t => `<span>${t}</span>`).join('');

    // GitHub Link
    if (data.github) {
      pGithub.innerHTML = `
        <a href="${data.github}" target="_blank" class="btn" style="background: #24292e; color: #fff; border: none; display: flex; align-items: center; gap: 8px;">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2c-3.34.73-4.04-1.6-4.04-1.6a3.2 3.2 0 0 0-1.34-1.76c-1.09-.74.08-.73.08-.73a2.5 2.5 0 0 1 1.83 1.23 2.53 2.53 0 0 0 3.46 1 2.53 2.53 0 0 1 .76-1.6C7.1 16.7 4.33 15.7 4.33 11.3a4.69 4.69 0 0 1 1.25-3.24 4.36 4.36 0 0 1 .12-3.2s1.02-.33 3.34 1.24a11.5 11.5 0 0 1 6.08 0c2.32-1.57 3.34-1.24 3.34-1.24a4.36 4.36 0 0 1 .12 3.2 4.69 4.69 0 0 1 1.25 3.24c0 4.42-2.77 5.4-5.42 5.7a2.83 2.83 0 0 1 .8 2.2v3.27c0 .32.21.7.83.58A12 12 0 0 0 12 .5Z"/></svg>
          View GitHub Repo
        </a>`;
    } else {
      pGithub.innerHTML = '';
    }

    // Video/Media logic
    if (data.video) {
      const isImg = /\.(png|jpe?g|gif|webp)$/i.test(data.video);
      if (isImg) {
        pVideo.innerHTML = `<img src="${data.video}" alt="${data.title}" style="width: 100%; border-radius: 8px; height: auto; display: block;">`;
      } else {
        let type = "video/mp4";
        if (data.video.endsWith('.mov')) type = "video/quicktime";
        pVideo.innerHTML = `
              <video controls controlsList="nodownload" disablePictureInPicture style="width: 100%; border-radius: 8px;">
                  <source src="${data.video}" type="${type}">
                  Your browser does not support the video tag.
              </video>`;
      }
    } else {
      pVideo.innerHTML = `<div class="video-placeholder"><span>No Video Demo Available</span></div>`;
    }

    // Show
    projModal.hidden = false;
  });
});

// Close Modal
$$('[data-modal-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    projModal.hidden = true;
    pVideo.innerHTML = ''; // Stop video playback
  });
});

// Click outside to close
projModal.addEventListener('click', (e) => {
  if (e.target === projModal) {
    projModal.hidden = true;
    pVideo.innerHTML = '';
  }
});


// ====== AGENT INTERACTION ======
const agentChat = $('#agentChatWindow');
const chatMsgs = $('#chatMessages');
const chatInput = $('#chatInput');
const sendBtn = $('#sendMessage');

$('#openAgent')?.addEventListener('click', () => {
  agentChat.hidden = false;
  // Optional: focus input
  setTimeout(() => chatInput.focus(), 100);
});

$('#closeAgent')?.addEventListener('click', () => {
  agentChat.hidden = true;
});

function sendUserMessage() {
  const txt = chatInput.value.trim();
  if (!txt) return;

  // Append user msg
  const uDiv = document.createElement('div');
  uDiv.className = 'msg msg-user';
  uDiv.textContent = txt;
  chatMsgs.appendChild(uDiv);

  chatInput.value = '';
  chatMsgs.scrollTop = chatMsgs.scrollHeight;

  // Simulate Agent Reply
  setTimeout(() => {
    // Simple keyword matching for "AI" feel
    const lowerTxt = txt.toLowerCase();
    let reply = "Thanks for reaching out! I'm a demo agent right now, but Bakari can build me to answer complex queries about his work!";

    if (lowerTxt.includes('project') || lowerTxt.includes('work')) {
      reply = "Bakari has worked on dashboards, automation tools, and AI agents. Check out the 'Projects' section above!";
    } else if (lowerTxt.includes('contact') || lowerTxt.includes('email') || lowerTxt.includes('hire')) {
      reply = "You can contact Bakari via the form below or email directly. He is open to opportunities!";
    } else if (lowerTxt.includes('skill') || lowerTxt.includes('tool') || lowerTxt.includes('stack')) {
      reply = "Bakari specializes in Python, Power BI, UiPath, and Web Development (React/TS).";
    } else if (lowerTxt.includes('education') || lowerTxt.includes('degree') || lowerTxt.includes('university')) {
      reply = "Bakari holds a Bachelor's degree. Check out the Education section for more details.";
    } else if (lowerTxt.includes('certification') || lowerTxt.includes('credential') || lowerTxt.includes('license')) {
      reply = "Bakari has earned professional certifications. You can see the details in the Credentials section.";
    } else if (lowerTxt.includes('publication') || lowerTxt.includes('research') || lowerTxt.includes('paper')) {
      reply = "Bakari has published research in the field. You can find the list in the Publications section.";
    }

    const aDiv = document.createElement('div');
    aDiv.className = 'msg msg-agent';
    aDiv.textContent = reply;
    chatMsgs.appendChild(aDiv);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
  }, 1000);
}

sendBtn?.addEventListener('click', sendUserMessage);
chatInput?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendUserMessage();
});


// Scroll to Top Logic
const scrollToTopBtn = $('#scrollToTopBtn');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    scrollToTopBtn.hidden = false;
  } else {
    scrollToTopBtn.hidden = true;
  }
});

scrollToTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ====== CONTACT FORM SUBMISSION ======
const contactForm = $('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const submitBtn = $('#send');
    const originalText = submitBtn.textContent;

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Create and show success message
        const successMsg = document.createElement('div');
        successMsg.textContent = 'Your message has been submitted';
        successMsg.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: var(--accent);
          color: white;
          padding: 20px 40px;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          box-shadow: var(--shadow);
          z-index: 9999;
          animation: fadeIn 0.3s ease;
        `;
        document.body.appendChild(successMsg);

        // Reset form
        contactForm.reset();

        // Remove message after 3 seconds
        setTimeout(() => {
          successMsg.style.animation = 'fadeOut 0.3s ease';
          setTimeout(() => successMsg.remove(), 300);
        }, 3000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      alert('There was an error submitting your message. Please try again.');
    } finally {
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

