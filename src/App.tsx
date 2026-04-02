import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import TableView from "./pages/TableView";
import QueryEditor from "./pages/QueryEditor";
import SchemaBuilder from "./pages/SchemaBuilder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tables" element={<TableView />} />
          <Route path="query" element={<QueryEditor />} />
          <Route path="schema" element={<SchemaBuilder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
