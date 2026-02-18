import FacultyList from "./components/FacultyList";

const DRUPAL_URL = "http://localhost:8080";

async function getFaculty() {
  const res = await fetch(
    `${DRUPAL_URL}/drupal_headless/web/jsonapi/node/faculty_?include=field_photo,field_department`,
    { cache: "no-store" }
  );

  return res.json();
}

export default async function Home() {
  const data = await getFaculty();

  return <FacultyList data={data} />;
}
