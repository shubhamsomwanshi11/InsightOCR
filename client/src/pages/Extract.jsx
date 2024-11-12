import React, { useState } from 'react'
import Features from '../components/Features';
import FAQ from '../components/FAQ';
import ChooseData from '../components/ChooseData';
import sampleiamge from '../assets/InsighOCR.jpg'
const Extract = () => {
    return (
        <div className="container">
            <ChooseData />
            <hr />
            <div className='mx-auto w-100 d-flex justify-content-center' >
                <img src={sampleiamge} className="p-5 rounded mx-auto" style={{ height: '500px' }} alt="InsightOCR image" />
            </div>
            <Features />
            <hr />
            <FAQ />
        </div>
    )
}

export default Extract;
