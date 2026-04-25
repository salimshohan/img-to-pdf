document.getElementById('convertBtn').addEventListener('click', async () => {
    const imageInput = document.getElementById('imageInput');
    const files = imageInput.files;

    // যদি কোনো ছবি সিলেক্ট না করা হয়
    if (files.length === 0) {
        alert('দয়া করে অন্তত একটি ছবি নির্বাচন করুন!');
        return;
    }

    // বাটনটিকে "Converting..." অবস্থায় নেওয়া
    const convertBtn = document.getElementById('convertBtn');
    convertBtn.textContent = 'Converting Please Wait...';
    convertBtn.disabled = true;

    // jsPDF লাইব্রেরি চালু করা
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imgData = await readFileAsDataURL(file);
        
        // প্রথম ছবির পর বাকি ছবির জন্য নতুন পেজ নেওয়া
        if (i > 0) {
            pdf.addPage();
        }

        // ছবিটিকে PDF এর সাইজ অনুযায়ী ঠিক করা
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // PDF এ ছবি যুক্ত করা
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }

    // PDF ফাইল সেভ বা ডাউনলোড করা
    pdf.save('Converted_Document.pdf');

    // কাজ শেষ হলে বাটন আগের অবস্থায় ফিরিয়ে আনা
    convertBtn.textContent = 'Convert to PDF';
    convertBtn.disabled = false;
    imageInput.value = ''; // ইনপুট ক্লিয়ার করা
});

// ছবিকে Data URL এ কনভার্ট করার হেল্পার ফাংশন
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
    });
}