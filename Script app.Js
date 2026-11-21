JavaScript

/* =========================================
   1. FORM VALIDATION
   Anonymous Feedback and Issue Dashboard
   ========================================= */

function validateForm() {
    const category = document.getElementById("category");
    const audience = document.getElementById("audience");
    const message = document.getElementById("message");
    const confirm = document.getElementById("confirm");
    const formMessage = document.getElementById("form-message");

    // Clear previous error message
    formMessage.textContent = "";
    formMessage.style.color = "red";

    // Check category
    if (!category.value) {
        formMessage.textContent =
            "Please select a feedback category.";
        category.focus();
        return false;
    }

    // Check audience
    if (!audience.value) {
        formMessage.textContent =
            "Please select your audience.";
        audience.focus();
        return false;
    }

    // Check message
    const feedbackText = message.value.trim();

    if (feedbackText.length === 0) {
        formMessage.textContent =
            "Please enter your feedback message.";
        message.focus();
        return false;
    }

    // Require at least 20 characters
    if (feedbackText.length < 20) {
        formMessage.textContent =
            "Feedback must contain at least 20 characters.";
        message.focus();
        return false;
    }

    // Check for personal information
    const emailPattern =
        /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

    const phonePattern =
        /(?:\+?\d[\d\s()-]{7,}\d)/;

    const registrationPattern =
        /\b(reg|registration|student)\s*(no|number|id)?\s*[:#-]?\s*[A-Z0-9-]{5,}\b/i;

    if (
        emailPattern.test(feedbackText) ||
        phonePattern.test(feedbackText) ||
        registrationPattern.test(feedbackText)
    ) {
        formMessage.textContent =
            "Please remove personal information to maintain anonymity.";
        message.focus();
        return false;
    }

    // Check optional rating
    const selectedRating =
        document.querySelector('input[name="rating"]:checked');

    if (selectedRating) {
        const rating = Number(selectedRating.value);

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            formMessage.textContent =
                "Rating must be between 1 and 5.";
            return false;
        }
    }

    // Check anonymity confirmation
    if (!confirm.checked) {
        formMessage.textContent =
            "Please confirm that your feedback is anonymous.";
        confirm.focus();
        return false;
    }

    return true;
}


/* =========================================
   2. HANDLE FORM SUBMISSION
   ========================================= */

function handleSubmit(event) {
    event.preventDefault();

    // Stop submission if validation fails
    if (!validateForm()) {
        return;
    }

    const category =
        document.getElementById("category").value;

    const audience =
        document.getElementById("audience").value;

    const message =
        document.getElementById("message").value.trim();

    const selectedRating =
        document.querySelector('input[name="rating"]:checked');

    // Rating is optional
    const rating = selectedRating
        ? Number(selectedRating.value)
        : null;

    // Create anonymous feedback object
    const feedback = {
        id: Date.now(),
        category: category,
        audience: audience,
        message: message,
        rating: rating,
        status: "Open",
        date: new Date().toISOString()
    };

    // Save using the existing project function
    addFeedback(feedback);

    // Show success message
    const formMessage =
        document.getElementById("form-message");

    formMessage.style.color = "green";
    formMessage.textContent =
        "Your anonymous feedback has been submitted successfully!";

    // Reset form
    document.getElementById("feedback-form").reset();

    // Reset character count if available
    const charCount =
        document.getElementById("char-count");

    if (charCount) {
        charCount.textContent = "0";
    }

    // Refresh dashboard
    refreshAll();
}

// Connect validation to the feedback form
document
    .getElementById("feedback-form")
    .addEventListener("submit", handleSubmit);
