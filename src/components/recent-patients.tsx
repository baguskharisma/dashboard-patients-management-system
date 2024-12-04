import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const recentPatients = [
  { name: "John Doe", date: "2023-06-01", status: "Checked-in" },
  { name: "Jane Smith", date: "2023-06-02", status: "Appointment" },
  { name: "Bob Johnson", date: "2023-06-03", status: "Discharged" },
];

export function RecentPatients() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Patients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentPatients.map((patient, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Avatar>
                <AvatarFallback>{patient.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{patient.name}</p>
                <p className="text-sm text-gray-500">{patient.date}</p>
              </div>
              <div className="ml-auto">
                <span className="text-sm font-medium text-blue-500">
                  {patient.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
