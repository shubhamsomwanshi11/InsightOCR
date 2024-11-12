import React from 'react'
import { IoIosRocket } from 'react-icons/io'
import HomeImage from '../assets/Home.png'
import Features from '../components/Features'
import FAQ from '../components/FAQ'

const Home = () => {
  return (
    <div className="container text-center">
      <div className="row mt-5 align-items-center">
        <div className="col-lg-6 mb-4 mb-lg-0 d-none d-lg-block">
          <img src={HomeImage} className="rounded img-fluid mx-auto d-block" alt="Home" />
        </div>

        <div className="col-lg-6">
          <img
            className="rounded mb-4 img-fluid mx-auto"
            src="https://static.vecteezy.com/system/resources/thumbnails/049/327/314/small/laptop-document-3d-business-icon-png.png"
            alt="Laptop Document Icon"
          />
          <p className="fs-5 mx-auto">
            Developers, want to extract data from standard documents into structured formats like JSON, CSV, XML, or TEXT using the latest OCR technology? We’ve got you covered! Start transforming your documents with ease. What are you waiting for?
          </p>
          <a href='/extract' className="btn btn-primary btn-lg fw-semibold text-light mt-4">
            Get Started <IoIosRocket />
          </a>
        </div>
      </div>

      <hr className="mt-5" />

      <Features />
      <hr />
      <FAQ />
    </div>
  )
}

export default Home