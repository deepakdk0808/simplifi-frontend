import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Form, Button, Alert, Modal } from "react-bootstrap";
import "./App.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const [countryCodes, setCountryCodes] = useState([]);
  const [formData, setFormData] = useState({
    salutation: "",
    firstName: "",
    isdCode: "",
    mobile: "",
    email: "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate=useNavigate();

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const codes = data.map((country) => ({
          value:
            country.idd.root +
            (country.idd.suffixes ? country.idd.suffixes[0] : ""),
          label: `${country.name.common} (${country.idd.root}${
            country.idd.suffixes ? country.idd.suffixes[0] : ""
          })`,
        }));
        setCountryCodes(codes);
      })
      .catch((error) => console.error("Error fetching country codes:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://colo-dev.infollion.com/api/v1/self-registration/register",
        {
          email: formData.email,
          mobile: formData.isdCode + formData.mobile,
          name: formData.firstName,
          salutation: formData.salutation,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle success response
      if (response.data.success) {
        setAlertMessage(
          response.data.message ||
            "Registration successful! Please check your email for further instructions."
        );
        setAlertVariant("success");
        setShowAlert(true);
        setShowModal(true); // Show modal for OTP entry if applicable
        setTimeout(() => setShowAlert(false), 6000);
      } else {
        setAlertMessage("Unexpected response from server.");
        setAlertVariant("warning");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 6000);
      }
    } catch (error) {
      console.error(
        "Error sending registration request:",
        error.response?.data
      );
      const errors = error.response?.data?.errors || [];
      if (Array.isArray(errors) && errors.length > 0) {
        const errorMessages = errors.map((err) => err.msg).join("\n");
        setAlertMessage(errorMessages);
      } else if (error.response?.data?.error) {
        setAlertMessage(error.response.data.error);
      } else {
        setAlertMessage("An unexpected error occurred.");
      }
      setAlertVariant("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 6000);
    }
  };



  const handleOtpSubmit = async () => {
    const otp = formData.mobile.slice(-6); 

    if (/^\d{6}$/.test(otp)) {
      try {

        //actual logic for otp verification,but API is not working 
        
        // const response = await axios.post(
        //   "https://colo-dev.infollion.com/api/v1/self-registration/verify-otp",
        //   {
        //     action: "SelfRegister",
        //     otp: otp,
        //     email: formData.email,
        //   },
        //   {
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //   }
        // );

        // if (response.data.success) {
        //   setAlertMessage("OTP verified successfully!");
        //   setAlertVariant("success");
        //   setShowAlert(true);
        //   setShowModal(false);
        //   setTimeout(() =>{ setShowAlert(false)
        //     navigate('/success')
        //   }, 6000);
        // } else {
        //   setAlertMessage(response.data.message || "OTP verification failed!");
        //   setAlertVariant("danger");
        //   setShowAlert(true);
        //   setTimeout(() => setShowAlert(false), 6000);
        // }

        // Hardcoded success response for testing
        setAlertMessage("OTP verified successfully! (Hardcoded)");
        setAlertVariant("success");
        setShowAlert(true);
        setShowModal(false);
        setTimeout(() => {
          setShowAlert(false);
          navigate("/success");
        }, 6000);
      }
       catch (error) {
        console.error("Error verifying OTP:", error.response?.data);
        const errorMsg =
          error.response?.data?.message || "An unexpected error occurred.";

        setAlertMessage(errorMsg);
        setAlertVariant("danger");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 6000);
      }
    } else {
      setAlertMessage("Please enter a valid 6-digit OTP.");
      setAlertVariant("warning");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 6000);
    }
  };



  return (
    <div className="App">
      <div className="firstDiv">
        {showAlert && (
          <Alert variant={alertVariant} className="bottom-right-alert">
            {alertMessage.split("\n").map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </Alert>
        )}
        <img src="/sidePanel_new-iCiYVcEK.svg" alt="Infollion-Image" />
      </div>
      <div className="RegisterDiv">
        <img className="brandImg" src="/download.png" alt="Infollion-Image" />
        <p className="brandLine">Register as an Expert</p>
        <Form
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1px",
            width: "60%",
            margin: "0 auto",
          }}
        >
          <Row>
            <Col xs={12} md={4}>
              <Form.Group controlId="formSalutation">
                <Form.Label
                  className="custom-formLabel"
                  style={{ marginBottom: "0px" }}
                >
                  Mr/Mrs<span className="required">*</span>
                </Form.Label>
                <Form.Select
                  name="salutation"
                  value={formData.salutation}
                  onChange={handleChange}
                  required
                  className="custom-outline"
                  style={{
                    height: "30px",
                    padding: "0px 10px",
                    fontSize: "16px",
                  }}
                >
                  <option value="" disabled hidden></option>
                  <option value="Mr">MR</option>
                  <option value="Mrs">MRS</option>
                  <option value="Ms">MS</option>
                  <option value="Dr">DR</option>
                  <option value="Prof">PROF</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={8}>
              <Form.Group controlId="formFirstName">
                <Form.Label
                  className="custom-formLabel"
                  style={{ marginBottom: "0px" }}
                >
                  Name<span className="required">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="custom-outline"
                  style={{ height: "30px" }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={4}>
              <Form.Group controlId="formIsdCode">
                <Form.Label
                  className="custom-formLabel"
                  style={{ marginBottom: "0px" }}
                >
                  ISD Code<span className="required">*</span>
                </Form.Label>
                <Form.Select
                  name="isdCode"
                  value={formData.isdCode}
                  onChange={handleChange}
                  required
                  className="custom-outline"
                  style={{
                    height: "30px",
                    padding: "0px 10px",
                    fontSize: "16px",
                  }}
                >
                  <option value="" disabled hidden></option>
                  {countryCodes.map((code, index) => (
                    <option key={`${code.value}-${index}`} value={code.value}>
                      {`${code.label.slice(0, 3)} (${code.value})`}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={8}>
              <Form.Group controlId="formMobile">
                <Form.Label
                  className="custom-formLabel"
                  style={{ marginBottom: "0px" }}
                >
                  Mobile Number<span className="required">*</span>
                </Form.Label>
                <Form.Control
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  className="custom-outline"
                  style={{ height: "30px" }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="formEmail">
            <Form.Label
              className="custom-formLabel"
              style={{ marginBottom: "0px" }}
            >
              Email<span className="required">*</span>
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="custom-outline"
              style={{ height: "30px", outlineWidth: "2px" }}
            />
          </Form.Group>

          <Button className="custom-button" type="submit" variant="primary">
            Get OTP
          </Button>
        </Form>
        <p className="extra-signin">Already have an account? Sign In</p>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "medium",
              fontWeight: "light",
            }}
          >
            Enter OTP
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            pattern="\d*"
            placeholder="6-digit OTP"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="custom-button"
            variant="primary"
            onClick={handleOtpSubmit}
          >
            Verify OTP
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Register;
