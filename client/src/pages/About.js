import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About us - HomeCart"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/about.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p className="text-justify mt-2">
          Welcome to HomeCart! We are committed to simplifying the way you manage your household
           inventory with innovative and user-friendly solutions. Our mission is to empower you with 
           smart tools that make home management efficient and stress-free. At HomeCart, we value efficiency,
            reliability, and innovation, ensuring that our platform evolves to meet your needs. With features 
            like comprehensive inventory tracking, smart barcode scanning, custom alerts for low stock or 
            expiring items, and an intuitive user interface, HomeCart is designed to make organizing your
             home seamless. Thank you for choosing HomeCart as your trusted partner in managing your household essentials. We're here to make your life easier!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
