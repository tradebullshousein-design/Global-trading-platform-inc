// ==============================
// Global Trading Platform
// script.js
// ==============================

document.addEventListener("DOMContentLoaded", () => {

  // Loading Screen
  const loader = document.getElementById("loader");

  window.addEventListener("load", () => {
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => loader.remove(), 500);
    }
  });

  // Sticky Header
  const header = document.querySelector("header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
  });

  // Mobile Menu
  const menuBtn = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav-links");

  menuBtn?.addEventListener("click", () => {
    nav.classList.toggle("active");
    menuBtn.classList.toggle("active");
  });

  // Back To Top
  const topBtn = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (!topBtn) return;

    if (window.scrollY > 500) {
      topBtn.classList.add("show");
    } else {
      topBtn.classList.remove("show");
    }
  });

  topBtn?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // Counter Animation
  const counters = document.querySelectorAll(".counter");

  const runCounter = counter => {

    const target = Number(counter.dataset.target);
    let value = 0;

    const speed = target / 120;

    const update = () => {

      value += speed;

      if (value < target) {
        counter.innerText = Math.floor(value);
        requestAnimationFrame(update);
      } else {
        counter.innerText = target.toLocaleString();
      }

    };

    update();

  };

  const counterObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }

    });

  });

  counters.forEach(counter => counterObserver.observe(counter));

  // Scroll Reveal
  const revealItems = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }

    });

  }, {
    threshold: 0.15
  });

  revealItems.forEach(item => revealObserver.observe(item));

  // FAQ Accordion
  document.querySelectorAll(".faq-item").forEach(item => {

    const question = item.querySelector(".faq-question");

    question?.addEventListener("click", () => {

      item.classList.toggle("open");

    });

  });

  // Contact Form Validation
  const form = document.getElementById("contactForm");

  form?.addEventListener("submit", e => {

    e.preventDefault();

    const name = form.querySelector("[name=name]").value.trim();
    const email = form.querySelector("[name=email]").value.trim();
    const phone = form.querySelector("[name=phone]").value.trim();
    const message = form.querySelector("[name=message]").value.trim();

    if (!name || !email || !phone || !message) {
      showToast("Please fill all fields.");
      return;
    }

    showToast("Message sent successfully!");
    form.reset();

  });

  // Toast
  function showToast(text) {

    let toast = document.createElement("div");

    toast.className = "toast";

    toast.innerText = text;

    document.body.appendChild(toast);

    setTimeout(() => {

      toast.classList.add("show");

    }, 100);

    setTimeout(() => {

      toast.classList.remove("show");

      setTimeout(() => {

        toast.remove();

      }, 400);

    }, 3000);

  }

  // Lazy Images
  document.querySelectorAll("img[data-src]").forEach(img => {

    const lazy = new IntersectionObserver(entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          img.src = img.dataset.src;

          img.removeAttribute("data-src");

          lazy.unobserve(img);

        }

      });

    });

    lazy.observe(img);

  });

}); line-height:1.2;

    margin-bottom:25px;

}

.hero-text p{

    color:var(--muted);

    margin-bottom:35px;

}

.hero-buttons{

    display:flex;

    gap:20px;

    flex-wrap:wrap;

}

.hero-image{

    position:relative;

}

.hero-image img{

    animation:float 5s ease-in-out infinite;

}

@keyframes float{

0%{transform:translateY(0);}
50%{transform:translateY(-20px);}
100%{transform:translateY(0);}

}

/* Stats */

.stats{

    display:grid;

    grid-template-columns:repeat(4,1fr);

    gap:25px;

    margin-top:60px;

}

.stat-card{

    padding:30px;

    text-align:center;

}

.stat-card h2{

    font-size:38px;

    color:var(--primary);

}

.stat-card span{

    color:var(--muted);

}ive');
            }
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    /* ==============================================
       7. Toast Notification System
       ============================================== */
    const toastContainer = document.getElementById('toast-container');

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.classList.add('toast');
        
        // Define Icon based on type
        let icon = type === 'success' ? '<i class="fa-solid fa-circle-check" style="color:var(--success)"></i>' : '<i class="fa-solid fa-circle-exclamation" style="color:var(--danger)"></i>';
        
        toast.innerHTML = `${icon} <span>${message}</span>`;
        toastContainer.appendChild(toast);

        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    /* ==============================================
       8. Form Validation & Submissions
       ============================================== */
    
    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation check
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if(name === '' || email === '' || message === '') {
                showToast('Please fill all required fields.', 'error');
                return;
            }

            // Simulate sending data
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                showToast('Message sent successfully! We will contact you soon.');
                contactForm.reset();
                btn.innerText = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletter-form');
    if(newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value.trim();
            
            if(email === '') {
                showToast('Please enter a valid email.', 'error');
                return;
            }

            showToast('Subscribed successfully to our newsletter!');
            newsletterForm.reset();
        });
    }

});