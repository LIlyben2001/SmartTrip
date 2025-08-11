export async function GET() {
  const data = [
    "United States","Canada","United Kingdom","France","Italy",
    "Spain","Germany","Australia","Japan","China","Greece","Turkey"
  ];
  return Response.json(data);
}
