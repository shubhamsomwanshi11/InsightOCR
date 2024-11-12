import React from 'react';
import { FaDropbox } from "react-icons/fa";
import DropboxChooser from 'react-dropbox-chooser';
import axios from 'axios';
import { toast } from 'react-toastify';

const DropBox = () => {
    const handleDropBoxPic = async (files) => {
        const fileUrl = files[0].link;

        try {
            // Step 1: Call the Dropbox API to create a shared link (direct download link)
            const response = await axios.post('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings',
                {
                    path: files[0].path_display,
                    settings: {
                        requested_visibility: 'public',
                    }
                }, {
                headers: {
                    'Authorization': `Bearer YOUR_ACCESS_TOKEN`, // Use your Dropbox OAuth token
                    'Content-Type': 'application/json',
                }
            });

            // Step 2: Get the direct download URL from the response
            const downloadUrl = response.data.url.replace('www.dropbox.com', 'dl.dropboxusercontent.com');

            // Now you have a direct URL to the file
            console.log('Direct download URL:', downloadUrl);
            toast.success('File fetched successfully!');

            // You can now use the downloadUrl as needed (e.g., download the file or display it)
        } catch (error) {
            console.error('Error fetching file from Dropbox:', error);
            toast.error('Failed to fetch file from Dropbox.');
        }
    };

    return (
        <DropboxChooser
            appKey={'qxk9pb63k2d7ugc'}
            success={(files) => handleDropBoxPic(files)}
            multiselect={false}
            extensions={[]}
        >
            <button onClick={()=>{toast.info("Coming Soon!")}} type="button" className="btn fs-5 fw-semibold dropbox-button">
                <FaDropbox className='fs-2 text-primary' />
            </button>
        </DropboxChooser>
    );
};

export default DropBox;