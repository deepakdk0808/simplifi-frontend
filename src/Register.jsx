import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Form, Button, Alert } from "react-bootstrap";
import "./App.css";

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
    // setErrorMessage(""); // Clear error message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mobileWithIsd = formData.isdCode + formData.mobile;

    try {
      const response = await axios.post(
        "http://localhost:12676/users/sendOTP",
        {
          ...formData,
          mobile: mobileWithIsd,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setAlertMessage("OTP sent successfully!");
        setAlertVariant("success");
        setShowAlert(true);
      }
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (Array.isArray(errors)) {
        const errorMessages = errors.map((err) => err.msg).join("\n");
        setAlertMessage(errorMessages);
      } else {
        setAlertMessage("An unexpected error occurred.");
      }
      setAlertVariant("danger");
      setShowAlert(true);
    }
  };

  return (
    <div className="App">
      <div className="firstDiv">
        {showAlert && (
          <Alert
            variant={alertVariant}
            onClose={() => setShowAlert(false)}
            dismissible
            className="bottom-right-alert"
          >
            {alertMessage}
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
          onSubmit={handleSubmit} // Directly call handleSubmit
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
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
                  Mr/Mrs
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
                  Name
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
                  ISD Code
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
                      {code.label}
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
                  Mobile Number
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
              Email
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
    </div>
  );
}

export default Register;
