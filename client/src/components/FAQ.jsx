const faqData = [
    {
        question: "What types of documents can InsightOCR process?",
        answer: "InsightOCR can process a variety of document types, including images (JPG, PNG) and multi-page PDFs. It’s versatile enough to handle documents like passports, licenses, invoices, and more."
    },
    {
        question: "How does InsightOCR extract data from documents?",
        answer: "InsightOCR uses advanced Optical Character Recognition (OCR) technology to convert text in images or PDFs into structured data. It can then intelligently parse information based on the document type and specified fields."
    },
    {
        question: "Is my data secure with InsightOCR?",
        answer: "Yes, InsightOCR implements industry-standard encryption and access controls to ensure data security and compliance with privacy regulations, including GDPR."
    },
    {
        question: "What happens if the document quality is poor?",
        answer: "InsightOCR has built-in error handling and validation to manage low-quality images or incomplete documents. However, for best results, high-resolution and clear documents are recommended."
    },
    {
        question: "Can I export extracted data?",
        answer: "Yes, you can export the extracted data in various formats, including CSV, JSON, and PDF. InsightOCR also integrates with third-party systems to transfer data as needed."
    },
    {
        question: "Does InsightOCR save processed documents?",
        answer: "InsightOCR securely stores processed data in a database with timestamps and document metadata. You can access and manage this information through the dashboard, with options for reviewing, re-downloading, or securely deleting data."
    },
    {
        question: "Can I customize which fields InsightOCR extracts?",
        answer: "Yes, InsightOCR allows you to customize field extraction by setting up templates for different document types. This ensures accurate and relevant data extraction for various documents."
    }
];

const FAQ = () => {
    return (
        <div className="container mt-5" id="faq">
            <div className="faq-section ">
                <h3 className="fs-4 text-center mb-5">Frequently Asked Questions</h3>
                <div className="accordion" id="faqAccordion">
                    {faqData.map((faq, index) => (
                        <div className="accordion-item mb-3" key={index}>
                            <h2 className="accordion-header " id={`heading${index}`}>
                                <button
                                    className="accordion-button fw-semibold"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapse${index}`}
                                    aria-expanded="true"
                                    aria-controls={`collapse${index}`}
                                >
                                    {faq.question}
                                </button>
                            </h2>
                            <div
                                id={`collapse${index}`}
                                className="accordion-collapse collapse"
                                aria-labelledby={`heading${index}`}
                                data-bs-parent="#faqAccordion"
                            >
                                <div className="accordion-body">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;