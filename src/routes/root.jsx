// src/routes/root.jsx
import React from 'react';
// KORJAUS 1: 'react-router-dom' korvattu 'react-router'
import { Outlet } from 'react-router';
import NotificationController from '../components/notifications/Controller';
import CookieConsent from '../components/CookieConsent';

// Koska tämä on Framework Mode Layout, se tarvitsee DefaultLayoutin sisällön
import { LayoutContainer } from '../layouts/Default';
// Huomaa: LayoutContainerin importti tarvitaan edelleen sen NavBarin takia!

// Tämä on sovelluksen globaali Layout (korvaa vanhan DefaultLayoutin)
export default function Root() {
  return (
    <>
      {/* background */}
      <div className="min-height-300 bg-primary position-absolute w-100" />
      <main className="main-content position-relative border-radius-lg max-height-vh-100 h-100">
        <NotificationController />

        {/* TÄMÄ ON TÄRKEÄ! Outlet renderöi ALAMUODON LayoutContainerin sisälle */}
        <LayoutContainer isRootLayout={true} />

        <CookieConsent />
      </main>
    </>
  );
}
