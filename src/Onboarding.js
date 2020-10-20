import React, { useEffect } from "react";

import ClaimNumber from "./components/Onboarding/ClaimNumber";
import {
  useParams,
} from "react-router-dom";

function Onboarding() {
  let { step } = useParams();

  if (step === "claim") {
    return <ClaimNumber />;
  }

  return (
    <>
      <p>Onboarding Module</p>
    </>
  );
}

export default Onboarding;
