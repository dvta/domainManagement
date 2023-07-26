import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Domains from "../pages/domains/Domains.jsx";
import Default from "../layouts/Default.jsx";
import AddDomain from "../pages/domains/AddDomain.jsx";
import EditDomain from "../pages/domains/EditDomain.jsx";
import NotFound from "../components/NotFound.jsx";
import Emails from "../pages/emails/Emails.jsx";
import Redirects from "../pages/redirects/Redirects.jsx";
import AddEmail from "../pages/emails/AddEmail.jsx";
import EditEmailQuota from "../pages/emails/EditEmailQuota.jsx";
import EditEmailPassword from "../pages/emails/EditEmailPassword.jsx";
import AddRedirect from "../pages/redirects/AddRedirect.jsx";
import UserEmails from "../pages/Inbox/UserEmails.jsx";


export default function () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"*"} element={<NotFound/>}/>
        <Route element={<Default/>}>
          <Route path={"/"} element={<Domains/>}/>
          <Route path={"/domains"} element={<Domains/>}/>
          <Route path={"/domains/create"} element={<AddDomain/>}/>
          <Route path={"/domains/change-path"} element={<EditDomain/>}/>

          <Route path={"/emails"} element={<Emails/>}/>
          <Route path={"/emails/create"} element={<AddEmail/>}/>
          <Route path={"/emails/change-quota"} element={<EditEmailQuota/>}/>
          <Route path={"/emails/change-password"} element={<EditEmailPassword/>}/>

          <Route path={"/redirects"} element={<Redirects/>}/>
          <Route path={"/redirects/create"} element={<AddRedirect/>}/>
        </Route>

        <Route>
          <Route path={'email/:type?'} element={<UserEmails/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export class Router {
}
