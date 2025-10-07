document.addEventListener("DOMContentLoaded", () => {
  
  // --- Helper Functions for Form UI ---

  /**
   * Shows an error message for a specific input field.
   * @param {HTMLInputElement} inputElement The input element to highlight.
   * @param {string} message The error message to display.
   */
  const showError = (inputElement, message) => {
    const formGroup = inputElement.parentElement;
    const errorElement = formGroup.querySelector(".invalid-feedback");
    
    inputElement.classList.add("is-invalid");
    if (errorElement) {
      errorElement.innerText = message;
    }
  };

  /**
   * Clears all validation errors from a form.
   * @param {HTMLFormElement} formElement The form to clear errors from.
   */
  const clearErrors = (formElement) => {
    formElement.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
    formElement.querySelectorAll(".invalid-feedback").forEach((el) => (el.innerText = ""));
    const globalError = formElement.querySelector('.global-error');
    if (globalError) globalError.classList.add('d-none');
  };
  
  /**
   * Sets the loading state for a form's submit button.
   * @param {HTMLButtonElement} button The submit button.
   * @param {boolean} isLoading Whether the form is loading.
   */
  const setLoading = (button, isLoading) => {
    const buttonText = button.querySelector(".button-text");
    if (!buttonText) return; // Safety check

    if (isLoading) {
      button.disabled = true;
      button.querySelector(".spinner-border").classList.remove("d-none");
      buttonText.textContent = "Processing...";
    } else {
      button.disabled = false;
      button.querySelector(".spinner-border").classList.add("d-none");
      buttonText.textContent = button.dataset.originalText;
    }
  };


  // --- Registration Form Logic ---
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    const submitButton = registerForm.querySelector('button[type="submit"]');
    const buttonTextSpan = submitButton ? submitButton.querySelector('.button-text') : null;

    // Only set up the form if the button and its text span exist
    if (submitButton && buttonTextSpan) {
      submitButton.dataset.originalText = buttonTextSpan.textContent;
    
      registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearErrors(registerForm);

        const usernameInput = document.getElementById("username");
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const phoneInput = document.getElementById("phone");

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const phone = phoneInput.value.trim();

        let hasError = false;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^\+?[0-9]{10,15}$/;

        if (username.length < 3) {
          showError(usernameInput, "Username must be at least 3 characters long.");
          hasError = true;
        }
        if (!emailPattern.test(email)) {
          showError(emailInput, "Please enter a valid email address.");
          hasError = true;
        }
        if (password.length < 6) {
          showError(passwordInput, "Password must be at least 6 characters long.");
          hasError = true;
        }
        if (!phonePattern.test(phone)) {
          showError(phoneInput, "Please enter a valid phone number.");
          hasError = true;
        }
        if (hasError) return;

        setLoading(submitButton, true);
        try {
          const res = await fetch("https://flight-resevation-api.onrender.com/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password, phone }),
          });

          const data = await res.json();

          if (!res.ok) {
            if (data.error?.includes("email")) {
              showError(emailInput, "This email is already registered.");
            } else if (data.error?.includes("username")) {
              showError(usernameInput, "This username is already taken.");
            } else {
              showError(usernameInput, data.error || "An unknown error occurred.");
            }
          } else {
            alert("Registration successful! You will now be redirected to the login page.");
            window.location.href = "login.html";
          }
        } catch (err) {
          console.error("Registration Error:", err);
          showError(emailInput, "Cannot connect to the server. Please try again later.");
        } finally {
          setLoading(submitButton, false);
        }
      });
    }
  }


  // --- Login Form Logic ---
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const buttonTextSpan = submitButton ? submitButton.querySelector('.button-text') : null;
    
    // Only set up the form if the button and its text span exist
    if (submitButton && buttonTextSpan) {
      submitButton.dataset.originalText = buttonTextSpan.textContent;
      const globalError = loginForm.querySelector('.global-error');

      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearErrors(loginForm);

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        let hasError = false;
        if (!email) {
          showError(emailInput, "Email is required.");
          hasError = true;
        }
        if (!password) {
          showError(passwordInput, "Password is required.");
          hasError = true;
        }
        if(hasError) return;

        setLoading(submitButton, true);
        try {
          const res = await fetch("https://flight-resevation-api.onrender.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();

          if (res.ok) {
            localStorage.setItem("user", JSON.stringify(data.user));
            if (data.user.role === "admin") {
              window.location.href = "/admin.html";
            } else {
              window.location.href = "/index.html";
            }
          } else {
              if(globalError) {
                globalError.innerText = data.error || "Login failed. Please check your credentials.";
                globalError.classList.remove('d-none');
              } else {
                alert(data.error || "Login failed");
              }
          }
        } catch (err) {
          console.error("Login Error:", err);
          if(globalError) {
              globalError.innerText = "Cannot connect to the server. Please try again later.";
              globalError.classList.remove('d-none');
          } else {
              alert("Something went wrong");
          }
        } finally {
          setLoading(submitButton, false);
        }
      });
    }
  }

});

