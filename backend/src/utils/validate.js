export const ValidateSignUpData = (data) => {
    const {email,password,name,address,businessName} = data;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        throw new Error("Invalid email address.");
    }

    // Validate password (8-16 characters, at least one uppercase, one lowercase, one special character, and one number)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    if (!password || !passwordRegex.test(password)) {
        throw new Error("Password must be 8-16 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
    }

    // Validate name (should not be empty and should have a minimum length of 2 characters)
    if (!name || name.trim().length < 2) {
        throw new Error("Name must not be empty and should have at least 2 characters.");
    }

    // Validate business name (should not be empty)
    if (!businessName || businessName.trim().length === 0) {
        throw new Error("Business name must not be empty.");
    }

    // Validate address (should not be empty)
    if (!address || address.trim().length === 0) {
        throw new Error("Address must not be empty.");
    }

    return true; 
}

export const ValidateLoginData = (data) => {
    const { email, password } = data;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        throw new Error("Email is required.");
    }
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format.");
    }

    // Validate password
    if (!password) {
        throw new Error("Password is required.");
    }

    return true;
};


//Client Validation Logic
export const ValidateClientSignUpData = (data) => {
    const { name, email, address, phone } = data;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Email
    if (!email || !emailRegex.test(email)) {
        throw new Error("Invalid email address.");
    }

    // Name
    if (!name || name.trim().length < 2) {
        throw new Error("Name must not be empty and should have at least 2 characters.");
    }

    // Address
    if (!address || address.trim().length === 0) {
        throw new Error("Address must not be empty.");
    }

    // Phone - India OR USA only
    if (!phone || phone.trim().length === 0) {
        throw new Error("Phone number must not be empty.");
    }

    const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');

    const isIndian = /^[6-9]\d{9}$/.test(cleanPhone);
    const isUSA = /^\d{10}$/.test(cleanPhone);

    if (!isIndian && !isUSA) {
        throw new Error("Phone number must be either Indian (10 digits starting with 6-9) or USA (10 digits). Examples: 9876543210 or 1234567890");
    }

    return true;
}