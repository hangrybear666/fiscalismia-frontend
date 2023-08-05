import { useState } from "react";
import { useLocation } from 'react-router-dom';
import { resourceProperties as res } from "../resources/resource_properties";
import { menuEntries } from "../components/minor/MenuEntries";

export const mapLocationToMenu = () => {
  const location = useLocation();
  const absolutePath = location.pathname
  const relativePath = absolutePath.split(`${res.APP_ROOT_PATH}/`)[1]

  menuEntries
}
