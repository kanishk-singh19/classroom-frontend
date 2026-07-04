import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { dataProvider } from "./providers/data";
import { authProvider } from "./providers/auth";
import Dashboard from "./pages/dashboard";
import { BookOpen, GraduationCap, Home } from "lucide-react";
import { Layout } from "./components/refine-ui/layout/layout";
import SubjectsList from "./pages/subjects/list";
import SubjectsCreate from "./pages/subjects/create";
import SubjectsShow from "./pages/subjects/show";
import SubjectsEdit from "./pages/subjects/edit";
import ClassesList from "./pages/classes/list.tsx";
import ClassesCreate from "./pages/classes/create.tsx";
import Login from "./pages/login";
import Register from "./pages/register";


function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              authProvider={authProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "1K9lgR-pFFAtP-a2mfSn",
              }}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: {label:'Home', icon:<Home/>}
                },
                
                {
                  name: "subjects",
                  list: "/subjects",
                  create: "/subjects/create",
                  show: "/subjects/show/:id",
                  edit: "/subjects/edit/:id",
                  meta:{
                    label:'Subjects', icon:<BookOpen/>
                  }
                },
                {
                  name: "classes",
                  list: "/classes",
                  create: "/classes/create",
                  meta:{
                    label:'classes', icon:<GraduationCap/>
                  }
                }
              ]}
            >
              <Routes>
                {/* Protected app routes */}
                <Route
                  element={
                    <Authenticated
                      key="authenticated-routes"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route path = "/" element={<Dashboard />} />

                  <Route path="subjects">
                    <Route index element={<SubjectsList/>}/>
                    <Route path="create" element={<SubjectsCreate/>}/>
                    <Route path="show/:id" element={<SubjectsShow/>}/>
                    <Route path="edit/:id" element={<SubjectsEdit/>}/>

                  </Route>

                  <Route path="classes">
                    <Route index element={<ClassesList/>}/>
                    <Route path="create" element={<ClassesCreate/>}/>

                  </Route>

                </Route>

                {/* Public auth routes — redirect to app if already signed in */}
                <Route
                  element={
                    <Authenticated
                      key="auth-pages"
                      fallback={<Outlet />}
                    >
                      <NavigateToResource resource="dashboard" />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>

              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
