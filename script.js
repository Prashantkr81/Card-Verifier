document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        document.getElementById("card-tab").style.display =
            btn.dataset.tab === "card-tab" ? "block" : "none";
        document.getElementById("aadhaar-tab").style.display =
            btn.dataset.tab === "aadhaar-tab" ? "block" : "none";
    };
});

function detectCardBrand(num) {
    if (/^4/.test(num)) return "visa";
    if (/^5/.test(num)) return "mastercard";
    if (/^(6|81)/.test(num)) return "rupay";
    return "unknown";
}

const cardNumber = document.getElementById("cardNumber");
const cardNumberPreview = document.getElementById("cardNumberPreview");
const visaBadge = document.getElementById("visaBadge");
const mcBadge = document.getElementById("mcBadge");
const rupayBadge = document.getElementById("rupayBadge");
const previewExpiry = document.getElementById("previewExpiry");
const previewCvv = document.getElementById("previewCvv");
const expiryInput = document.getElementById("expiry");
const cvvInput = document.getElementById("cvv");
const cardBrandHint = document.getElementById("cardBrandHint");

function updatePreview() {
    let clean = cardNumber.value.replace(/\D/g, "");

    cardNumberPreview.textContent =
        clean.replace(/(.{4})/g, "$1 ").trim() || "•••• •••• •••• ••••";

    previewExpiry.textContent = expiryInput.value || "MM/YY";
    previewCvv.textContent = cvvInput.value ? "*".repeat(cvvInput.value.length) : "";

    visaBadge.style.visibility = "hidden";
    mcBadge.style.visibility = "hidden";
    rupayBadge.style.visibility = "hidden";

    const brand = detectCardBrand(clean);

    if (brand === "visa") visaBadge.style.visibility = "visible";
    else if (brand === "mastercard") mcBadge.style.visibility = "visible";
    else if (brand === "rupay") rupayBadge.style.visibility = "visible";
}

cardNumber.addEventListener("input", updatePreview);
expiryInput.addEventListener("input", updatePreview);
cvvInput.addEventListener("input", updatePreview);

function luhn(num) {
    let sum = 0, alt = false;
    for (let i = num.length - 1; i >= 0; i--) {
        let n = Number(num[i]);
        if (alt) n = n * 2 > 9 ? n * 2 - 9 : n * 2;
        sum += n;
        alt = !alt;
    }
    return sum % 10 === 0;
}

document.getElementById("checkCardBtn").onclick = () => {
    const num = cardNumber.value.replace(/\D/g, "");
    const status = document.getElementById("cardStatus");

    if (!num) {
        status.className = "status show error";
        status.textContent = "Enter a card number.";
        return;
    }

    status.className = "status show " + (luhn(num) ? "ok" : "error");
    status.textContent = luhn(num) ? "Valid Card" : "Invalid Card";
};

const d = [
 [0,1,2,3,4,5,6,7,8,9],
 [1,2,3,4,0,6,7,8,9,5],
 [2,3,4,0,1,7,8,9,5,6],
 [3,4,0,1,2,8,9,5,6,7],
 [4,0,1,2,3,9,5,6,7,8],
 [5,9,8,7,6,0,4,3,2,1],
 [6,5,9,8,7,1,0,4,3,2],
 [7,6,5,9,8,2,1,0,4,3],
 [8,7,6,5,9,3,2,1,0,4],
 [9,8,7,6,5,4,3,2,1,0]
];

const p = [
 [0,1,2,3,4,5,6,7,8,9],
 [1,5,7,6,2,8,3,0,9,4],
 [5,8,0,3,7,9,6,1,4,2],
 [8,9,1,6,0,4,3,5,2,7],
 [9,4,5,3,1,2,6,8,7,0],
 [4,2,8,6,5,7,3,9,0,1],
 [2,7,9,3,8,0,6,4,1,5],
 [7,0,4,6,9,1,3,2,5,8]
];

function verhoeff(num) {
    let c = 0;
    num = num.split("").reverse().join("");
    for (let i = 0; i < num.length; i++) {
        c = d[c][p[i % 8][parseInt(num[i])]];
    }
    return c === 0;
}

document.getElementById("checkAadhaarBtn").onclick = () => {
    const raw = document.getElementById("aadhaarNumber").value;
    const clean = raw.replace(/\D/g, "");
    const st = document.getElementById("aadhaarStatus");

    if (clean.length !== 12) {
        st.className = "status show error";
        st.textContent = "Aadhaar must be 12 digits.";
        return;
    }

    const ok = verhoeff(clean);
    st.className = "status show " + (ok ? "ok" : "error");
    st.textContent = ok ? "VALID Aadhaar" : "INVALID Aadhaar";
};
