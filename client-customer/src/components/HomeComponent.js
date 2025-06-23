import axios from 'axios';
import React, { Component } from 'react';
import '../App';
import { ImageSlider } from '../components/imageSlides';
import ContactSlider from '../components/ContactSlider';
import BrandComponent from '../components/BrandComponent'; // ✅ Thêm dòng này

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
    };
  }

  async componentDidMount() {
    await this.apiGetContact();
  }

  async apiGetContact() {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/customer/contacts`);
      this.setState({ contacts: res.data });
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  }

  render() {
    return (
      <div className="home-container">
        <div className="container">
          {/* Slider */}
          <ImageSlider />

          {/* OUR MANUFACTURERS */}
          
            <h2 className="section-title text-center">OUR MANUFACTURERS</h2>
            <div className="row">
              <ContactSlider logos={this.state.contacts} />
            </div>
          

          {/* PHUC AN Section */}
          <div className="section phucan-section py-5">
            <div className="container">
              <h2 className="section-title text-center mb-4">PHUC AN - ALWAYS THE RIGHT SOLUTION</h2>
              <p className="text-left mb-4">
                Phuc An is your reliable partner for industrial manufacturing, product distribution, and import-export solutions 
                throughout Vietnam and internationally. Our products are crafted from high-quality materials, designed for 
                professional applications, and strictly comply with industry-leading standards for quality and safety.
              </p>
              <p className="text-left mb-5">
                Behind our success is a strong network of domestic and international partners, supported by a modern logistics and 
                service infrastructure. This collaboration allows us to serve our clients both at home and abroad efficiently and 
                consistently. Delivering the best possible service and creating sustainable value for customers is the core mission 
                shared by all members of the Phuc An network.
              </p>
              <div className="row align-items-center">
                <div className="col-md-6">
                  <ul className="list-unstyled">
                    <li className="mb-3">
                      ✅ <strong>High-quality:</strong> Only when we are absolutely convinced of a tool do we recommend it to you.
                    </li>
                    <li className="mb-3">
                      ✅ <strong>Carefully:</strong> We approach each task differently and always do our best for you.
                    </li>
                    <li className="mb-3">
                      ✅ <strong>Delivery service of max. 24 hours:</strong> For stock items within Germany. We'd rather have our 
                      hands full before you come away empty-handed.
                    </li>
                    <li className="mb-3">
                      ✅ <strong>98% delivery ability:</strong> Due to the high availability of our stock items, you will have your 
                      orders in your hands the following day. You can work with that.
                    </li>
                    <li className="mb-3">
                      ✅ <strong>Always Right Solution:</strong> Phuc An stands for precision – in the project, in the product, in the result.
                    </li>
                  </ul>
                </div>
                <div className="col-md-6 text-center">
                  <img
                    src="/assets/Company.jpg"
                    alt="Phuc An Factory"
                    className="img-fluid rounded shadow"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Thêm phần BrandComponent */}
          <BrandComponent />

        </div>
      </div>
    );
  }
}

export default Home;
