import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { xml } from '@codemirror/lang-xml';
import { FaGoogleDrive, FaDropbox } from "react-icons/fa";
import { FaCopy } from "react-icons/fa";
import { GrOnedrive } from "react-icons/gr";
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import axios from 'axios';
import Loader from './Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DropBox from './Pickers/DropBox';
import Drive from './Pickers/Drive';
import Tree from './Tree';
import { downloadFile, convertToCSV, convertToXML, convertToPlainText } from './handlers/download';

const ChooseData = () => {
    const [jsonData, setJsonData] = useState({
        "State": "MAHARASHTRA",
        "Driving Licence No": "03",
        "DL No": "NUMBERS",
        "DOI": "DD-MM-YY",
        "Vehicle Type": "AT",
        "cov pol": "OV boamry",
        "Howe": "DoMMYY",
        "DOB": "DDMMYY",
        "BG": "V7",
        "Name": "NAME SURNAME",
        "Address": "ADDRESS na\na",
        "PIN": "NUMBERS",
        "Signature & ID of": "re Signature/ Thumb",
        "Text": "THE UNION OF INDIA “\nAl VAHARASHTRA STATE MOTOR DRIVING LICENCE \nwinn \nVat i obama (4m aT\nou omar. Bes\nOF VEHICLES THROUGHOUT INDIA | \n\n\nNamo:  ™~\n‘Add: \n\n"
    });
    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = useState(JSON.stringify(jsonData, null, 2));
    const [format, setFormat] = useState('JSON');
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState([]);
    const [currentExtension, setCurrentExtension] = useState(json({ jsx: true }));
    const [file, setFile] = useState();

    const handleInput = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            setIsLoading(true);
            try {
                const response = await axios.post('https://insightocr.onrender.com/extract', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (response) {
                    let extractedData = response.data.extractedData.trim();
                    if (extractedData.startsWith('```json')) {
                        extractedData = extractedData.replace(/^```json/, '').trim();
                    }
                    if (extractedData.endsWith('```')) {
                        extractedData = extractedData.replace(/```$/, '').trim();
                    }

                    const parsedData = JSON.parse(extractedData);
                    toast.success('Data Extracted Successfully!', {
                        position: 'top-right',
                        autoClose: 3000,
                    });

                    setJsonData(parsedData); // Set the jsonData state
                    setValue(JSON.stringify(parsedData, null, 2)); // Also update the value state for CodeMirror
                }
            } catch (error) {
                toast.error('Error Reading Data!', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                console.error("Error uploading file:", error);
            }
            finally {
                setIsLoading(false);
            }
        }
    };


    const handleFormatChange = (e) => {
        const newFormat = e.target.value;
        let newValue;
        let newExtension;
        switch (newFormat) {
            case 'CSV':
                if (Array.isArray(jsonData)) {
                    newValue = convertToCSV(jsonData);
                } else {
                    newValue = convertToCSV([jsonData]);
                }
                newExtension = json({ jsx: true });
                break;
            case 'XML':
                newValue = convertToXML(jsonData);
                newExtension = xml();
                break;
            case 'TEXT':
                newValue = convertToPlainText(jsonData);
                newExtension = json({ jsx: true });
                break;
            default:
                newValue = JSON.stringify(jsonData, null, 2);
                newExtension = json({ jsx: true });
        }

        setValue(newValue);
        setCurrentExtension(newExtension);
        setFormat(newFormat);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(value)
            .then(() => {
                toast.success('Copied to clipboard!', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            })
            .catch(err => {
                toast.error('Failed to copy!', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            });
    };

    const updateEditorVal = (filteredData) => {
        // Format the filtered data based on the current format
        let formattedValue;
        switch (format) {
            case 'CSV':
                formattedValue = convertToCSV([filteredData]);
                break;
            case 'XML':
                formattedValue = convertToXML(filteredData);
                break;
            case 'TEXT':
                formattedValue = convertToPlainText(filteredData);
                break;
            case 'JSON':
            default:
                formattedValue = JSON.stringify(filteredData, null, 2);
                break;
        }

        setValue(formattedValue);
    }

    return (
        <div className="card mt-4">
            <div className="card-body">
                <h2 className="fs-3 text-center mb-2">Extract from Document</h2>
                <div className="row">
                    <div className="col-5">
                        <div className="card">
                            <div className="card-body">
                                <div style={{ border: '4px dotted grey', borderRadius: '8px', padding: '20px' }}>
                                    <label htmlFor="formFileLg" className="form-label text-center fs-5 fw-semibold">Upload Document</label>
                                    <div className="row">
                                        <div className="col">
                                            <input className="form-control form-control-lg" id="formFileLg" onInput={handleInput} type="file" />
                                        </div>
                                        {/* <div className="col-2">
                                            <Drive />
                                        </div>
                                        <div className="col-2">
                                            <button disabled type="button" className="btn fs-5 fw-semibold"><GrOnedrive className='fs-2 text-primary' /></button>
                                        </div>
                                        <div className="col-2">
                                            <DropBox />
                                        </div> */}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="card" style={{ height: '100%' }}>
                            <div className="card-body">
                                <div style={{ border: '4px dotted purple', borderRadius: '8px', padding: '20px' }}>
                                    <label htmlFor="format" className="form-label fs-5 fw-semibold">Download Export Data</label>
                                    <div className="d-flex">
                                        <select
                                            className="form-select me-3"
                                            id="format"
                                            value={format}
                                            onChange={handleFormatChange}
                                        >
                                            <option value="JSON">JSON</option>
                                            <option value="XML">XML</option>
                                            <option value="CSV">CSV</option>
                                            <option value="TEXT">TEXT</option>
                                        </select>
                                        <button onClick={() => { downloadFile(format, value) }} className="btn fw-semibold btn-primary text-light">
                                            Export
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="card">
                            <div className="card-body">
                                <div style={{ border: '4px dotted #33ff33', borderRadius: '8px', padding: '5px' }}>
                                    <div className='text-center mt-2'>
                                        <span className="fs-5 fw-semibold text-center">Save Data</span>
                                    </div>
                                    <div className='d-flex justify-content-space-between' style={{ width: '100%' }}>
                                        <button type="button" onClick={() => { toast.info("Coming Soon!") }} className="btn fs-5"><FaGoogleDrive className='fs-2' /> <br /> GoogleDrive</button>
                                        <button type="button" onClick={() => { toast.info("Coming Soon!") }} className="btn fs-5 fw-semibold"><GrOnedrive className='fs-2 text-primary' /> <br />OneDrive</button>
                                        <button type="button" onClick={() => { toast.info("Coming Soon!") }} className="btn fs-5 fw-semibold"><FaDropbox className='fs-2 text-primary' /><br /> DropBox</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className='row mt-3' style={{ height: '80vh' }}>
                    <div className='col-8'>
                        <div className="row">
                            <div className="col-6">
                                <h3 className="fw-semibold mx-1">Result</h3>
                            </div>
                            <div className='col-6 d-flex justify-content-end mb-3'>
                                <select
                                    style={{ width: 'auto' }}
                                    className="form-select me-2"
                                    id="format"
                                    value={format}
                                    onChange={handleFormatChange}
                                >
                                    <option value="JSON">JSON</option>
                                    <option value="XML">XML</option>
                                    <option value="CSV">CSV</option>
                                    <option value="TEXT">TEXT</option>
                                </select>
                                <button className='btn btn-success fw-semibold' onClick={handleCopy}>Copy <FaCopy /></button>
                            </div>
                        </div>
                        <CodeMirror
                            style={{ height: '80vh', overflow: 'auto', width: '100%' }}
                            value={value}
                            extensions={[currentExtension]}
                            onChange={(val) => setValue(val)}
                        />
                    </div>
                    <div className='col-4 fs-5' style={{ padding: '20px', backgroundColor: '#f8f9fa', overflow: 'auto', height: '80vh' }}>
                        <h3 className='fs-3'>Choose fields to Extract</h3>
                        <hr />
                        <Tree checked={checked} updateEditorVal={updateEditorVal} expanded={expanded} setChecked={setChecked} setExpanded={setExpanded} jsonData={jsonData} />
                    </div>
                </div>
            </div>
            {isLoading &&
                <Loader />
            }
            <ToastContainer />
        </div>
    );
};

export default ChooseData;