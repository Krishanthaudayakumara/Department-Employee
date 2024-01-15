import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>About Krishantha Udaya Kumara</AccordionTrigger>
        <AccordionContent>
          Krishantha Udaya Kumara, a 3rd-year IT undergraduate and software
          engineer intern candidate.
          <br />
          Passionate about technology and eager to learn and contribute to
          challenging projects.
          <br />
          Demonstrated skills in full-stack development, including React, .NET
          Core, and SQL Server with this project
          <br />
          <div className="font-bold">
            More info:{" "}
            <a
              href="https://krishanthaudayakumara.github.io"
              className="text-blue-500"
            >
              https://krishanthaudayakumara.github.io
            </a>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>
          What key technologies did you use in this project?
        </AccordionTrigger>
        <AccordionContent>
          Frontend: ReactJS with TypeScript, Tailwind CSS, and ShadcnUI <br />
          Backend: .NET Core, SQL Server , ADO.net libraries, SQL stored
          procedures
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>
          Can you describe the system design and architecture?
        </AccordionTrigger>
        <AccordionContent>
          Frontend: React components for user interfaces, React Router for
          navigation, TypeScript for type safety <br />
          Backend: .NET Core web API for communication with the database, SQL
          Server for data storage
          <br />
          API communication: Frontend calls backend API endpoints to manage
          department and employee data
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>
          What specific features did you implement for data management?
        </AccordionTrigger>
        <AccordionContent>
          CRUD operations: Users can create, read, update, and delete both
          departments and employees
          <br />
          Validations: Data input is validated to ensure accuracy and
          consistency
          <br />
          Error handling: Graceful handling of errors to provide informative
          feedback to users
          <br />
          Age calculation: Employee age is automatically calculated based on
          date of birth with DOB function defined
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-5">
        <AccordionTrigger>
          What are some of the UI design choices you made?
        </AccordionTrigger>
        <AccordionContent>
          Tailwind CSS: Used for styling and layout, providing a clean and
          customizable design
          <br />
          Shadcn UI: Modern and latest UI library which leveraged for pre-built
          React components to accelerate development
          <br />
          Focus on user experience: Designed interfaces for clarity and ease of
          use
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-6">
        <AccordionTrigger>
          Can you elaborate on your approach to code reusability and
          maintainability?
        </AccordionTrigger>
        <AccordionContent>
          Component-based architecture: React components promote code
          reusability and modularity
          <br />
          TypeScript: Enforces type safety, making code more readable and
          maintainable
          <br />
          Clear code structure and comments: Enhance code clarity and
          understanding
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
