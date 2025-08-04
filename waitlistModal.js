// Waitlist Modal Functionality

const AIRTABLE_CONFIG = {
    baseId: 'YOUR_AIRTABLE_BASE_ID',
    tableName: 'Waitlist',
    apiKey: 'YOUR_AIRTABLE_API_KEY'
};

class WaitlistModal {
    constructor() {
        this.modal = document.getElementById('waitlistModal');
        this.form = document.getElementById('waitlistForm');
        this.closeBtn = document.getElementById('closeModal');
        this.submitBtn = document.getElementById('submitBtn');
        this.successMessage = document.getElementById('successMessage');
        this.errorMessage = document.getElementById('errorMessage');
        
        this.init();
    }

    init() {
        // Add click listeners to all "Join the waitlist" buttons
        const waitlistButtons = document.querySelectorAll('[data-action="join-waitlist"]');
        waitlistButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        });

        // Add listeners to buttons with text "Join the waitlist" or "Join Waitlist"
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            const buttonText = button.textContent.trim().toLowerCase();
            if (buttonText.includes('join') && buttonText.includes('waitlist')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openModal();
                });
            }
        });

        // Close modal listeners
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        setTimeout(() => {
            document.getElementById('firstName').focus();
        }, 300);
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.resetForm();
    }

    resetForm() {
        this.form.reset();
        this.hideMessages();
        this.setSubmitButtonState(false);
    }

    hideMessages() {
        this.successMessage.style.display = 'none';
        this.errorMessage.style.display = 'none';
    }

    setSubmitButtonState(loading) {
        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnLoading = this.submitBtn.querySelector('.btn-loading');
        
        if (loading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            this.submitBtn.disabled = true;
        } else {
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            this.submitBtn.disabled = false;
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        this.hideMessages();
        this.setSubmitButtonState(true);

        const formData = new FormData(this.form);
        const data = {
            firstName: formData.get('firstName').trim(),
            lastName: formData.get('lastName').trim(),
            email: formData.get('email').trim().toLowerCase()
        };

        // Basic validation
        if (!data.firstName || !data.lastName || !data.email) {
            this.showError('Please fill in all fields.');
            this.setSubmitButtonState(false);
            return;
        }

        if (!this.isValidEmail(data.email)) {
            this.showError('Please enter a valid email address.');
            this.setSubmitButtonState(false);
            return;
        }

        try {
            await this.submitToAirtable(data);
            this.showSuccess();
            
            // Auto close modal after 3 seconds
            setTimeout(() => {
                this.closeModal();
            }, 3000);
            
        } catch (error) {
            console.error('Submission error:', error);
            this.showError('Something went wrong. Please try again.');
        } finally {
            this.setSubmitButtonState(false);
        }
    }

    async submitToAirtable(data) {
        // If no Airtable config is set, simulate success (for demo purposes)
        if (AIRTABLE_CONFIG.baseId === 'YOUR_AIRTABLE_BASE_ID') {
            console.log('Demo mode: Would submit to Airtable:', data);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Simulate occasional errors for testing
            if (Math.random() < 0.1) {
                throw new Error('Simulated network error');
            }
            
            return;
        }

        const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableName}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    'First Name': data.firstName,
                    'Last Name': data.lastName,
                    'Email': data.email,
                    'Signup Date': new Date().toISOString(),
                    'Source': 'Website Waitlist'
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    showSuccess() {
        this.form.style.display = 'none';
        this.successMessage.style.display = 'flex';
    }

    showError(message) {
        this.errorMessage.querySelector('p').textContent = message;
        this.errorMessage.style.display = 'flex';
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Initialize the waitlist modal when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WaitlistModal();
});

// Also initialize if the script loads after DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new WaitlistModal();
    });
} else {
    new WaitlistModal();
}
