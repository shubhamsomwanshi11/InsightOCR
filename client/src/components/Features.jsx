import React from 'react';
import json from '../assets/Featues/json.png';
import format from '../assets/Featues/format.png';
import ocr from '../assets/Featues/ocr.png';
import parsing from '../assets/Featues/parsing.png';
import processing from '../assets/Featues/processing.png';
import security from '../assets/Featues/security.png';
import validation from '../assets/Featues/validation.png';

const featuresData = [
    {
        img: format,
        title: "Document Upload Support",
        subtitle: ["Supports multiple file types (e.g., PDFs, JPG, PNG).", "Drag-and-drop upload and file preview option."]
    },
    {
        img: ocr,
        title: "Optical Character Recognition (OCR)",
        subtitle: ["Extracts text accurately from images and scanned documents.", "Supports multiple languages for recognition."]
    },
    {
        img: parsing,
        title: "Intelligent Data Parsing",
        subtitle: ["Extracts specific fields like Name, Date of Birth, Address, etc.", "Configurable templates for various document types."]
    },
    {
        img: processing,
        title: "Image and PDF Processing",
        subtitle: ["Handles high-resolution images and multi-page PDFs.", "Converts scanned PDFs into editable text."]
    },
    {
        img: validation,
        title: "Data Validation & Error Handling",
        subtitle: ["Validates extracted data format (e.g., date format).", "Error handling for low-quality or incomplete documents."]
    },
    {
        img: json,
        title: "Export Options",
        subtitle: ["Export data to CSV, JSON, PDF.", "Integrates with third-party systems for data transfer."]
    },
    {
        img: security,
        title: "Security & Compliance",
        subtitle: ["Data encryption, access control, and GDPR compliance.", "Configurable data retention policies and secure deletion."]
    }
];

const Features = () => {
    return (
        <div className='text-center' id='features'>
            <h3 className='fs-3'>Features</h3>
            <div className="row mt-5">
                {
                    featuresData.map((feature, index) => (
                        <div className="col-lg-4 col-md-6 col-12 mb-3 mb-3" key={"feature" + index} >
                            <div className="card fcard" style={{ height: '100%' }}>
                                <div className="card-body">
                                    <img src={feature.img} className='img-fluid rounded' style={{ height: '60px' }} alt={feature.title} />
                                    <p className='fs-5 fw-semibold'>{feature.title}</p>
                                    <hr />
                                    <ul className="list-unstyled">
                                        {
                                            feature.subtitle.map((sub, idx) => (
                                                <li key={idx}>{sub}</li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Features;