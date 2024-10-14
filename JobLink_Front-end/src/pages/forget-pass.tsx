// pages/EmailInput.js
import React, { useState } from "react";
import { Input, Button, Container, Text, Spacer } from "@nextui-org/react";
import { useRouter } from "next/router";

const EmailInput = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleEmailSubmit = () => {
    // Navigate to OTP page with email
    router.push({
      pathname: "/OtpVerification",
      query: { email },
    });
  };

  return (
    <Container
      css={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#f0f4f8",
        padding: "20px",
      }}
    >
      <Text h1 css={{ color: "#333" }}>
        Welcome!
      </Text>
      <Text css={{ textAlign: "center", color: "#555", marginBottom: "20px" }}>
        Please enter your email to receive the OTP.
      </Text>
      <Input
        clearable
        underlined
        labelPlaceholder="Enter your email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        css={{ width: "100%", maxWidth: "400px", marginBottom: "20px" }}
      />
      <Button
        onClick={handleEmailSubmit}
        disabled={!email}
        css={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#0072F5",
          "&:hover": {
            backgroundColor: "#005BB5",
          },
        }}
      >
        Send OTP
      </Button>
    </Container>
  );
};

export default EmailInput;
