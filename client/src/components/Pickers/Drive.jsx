import React from 'react'
import { FaGoogleDrive } from "react-icons/fa";
import useDrivePicker from 'react-google-drive-picker'


const Drive = () => {
    const [openPicker, authResponse] = useDrivePicker();
    const handleOpenPicker = () => {
        openPicker({
            clientId: "944264633626-iso2nbknigo5h6rmm3dr6pcmmgj1tdmt.apps.googleusercontent.com",
            developerKey: "AIzaSyBzeDKSf36y7LKi3x_KhgsjrNG_0ah3bow",
            viewId: "DOCS",
            // token: token, // pass oauth token in case you already have one
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: true,
            // customViews: customViewsArray, // custom view
            callbackFunction: (data) => {
                if (data.action === 'cancel') {
                    console.log('User clicked cancel/close button')
                }
                console.log(data)
            },
        })
    }


    return (
        <button type="button" className="btn fs-5" disabled onClick={handleOpenPicker}><FaGoogleDrive className='fs-2' /> </button>
    )
}

export default Drive