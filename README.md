### **AxenAPI UI Description**

**AxenAPI** is a powerful and intuitive tool designed for designing, managing, and documenting distributed systems architectures, such as microservices or message-based systems. Its user-friendly interface allows users to visualize, edit, and manage the components of a system, including services, topics, events, and brokers. AxenAPI provides a comprehensive set of features to streamline system architecture workflows while ensuring flexibility, clarity, and ease of use.

---

### **Key Features of AxenAPI UI:**

1. **System Visualization**:
   - The system is represented as a graph where nodes (services, topics, events) and their connections are displayed.
   - Users can easily view relationships between components, such as which service produces or consumes messages from specific topics.

2. **Component Management**:
   - **Services**: Create, rename, and delete services directly through the UI.
   - **Topics**: Add, edit (including selecting broker types), and remove topics. Topics can be filtered by tags for easier navigation.
   - **Events**: Manage events, including editing their JSON Schema and generating example data.

3. **Broker Management**:
   - Maintain a list of message brokers (e.g., Apache Kafka, RabbitMQ, JMS, Other).
   - Add, edit, or delete brokers with optional links to external resources.
   - Ensure unique broker names and validate mandatory fields (name and type).

4. **Filtering and Search**:
   - Filter objects in the graph by tags to focus on relevant components.
   - Reset filters to display all components.

5. **Information Panel**:
   - Access detailed information about selected components (e.g., services, topics) via a dedicated information panel.
   - View and edit properties, connections, and metadata.

6. **JSON Schema Editor**:
   - Create, edit, and export JSON Schema for events.
   - Generate example data based on the provided JSON Schema.
   - Switch between "Schema" and "Data Example" modes to preview how data conforms to the schema.

7. **Export and Import**:
   - Import existing system specifications to populate the graph.
   - Export the current configuration into human-readable formats like DOC or PDF for sharing with stakeholders.

8. **Topic Details**:
   - Expand topic details to see all associated events, including those being produced or consumed.
   - Interact with event configurations directly from the topic detail view.

9. **Link Management**:
   - Add, edit, and remove links to external brokers or resources.
   - Validate and ensure consistency of link references.

10. **Printable Forms**:
    - Generate printable versions of system specifications in DOC or PDF formats.
    - Customize exports to include only selected services or components.

---

### **User Interface Highlights**:

- **Graph-Based Navigation**:
  - The main workspace displays the system as an interactive graph, making it easy to understand relationships between components.
  - Users can interact with nodes (double-click to edit, right-click for context menus, etc.).

- **Context Menus**:
  - Right-click on nodes or items in the left-hand menu to access quick actions like "Edit," "Delete," or "View Details."

- **Inline Editing**:
  - Rename services or topics directly by double-clicking their names in the graph.

- **Dynamic Updates**:
  - Changes made to components (e.g., renaming, adding links) are reflected immediately in both the graph and the left-hand menu.

- **Error Handling**:
  - The system validates user inputs (e.g., unique names, required fields) and provides clear error messages when issues arise.

---

### **Target Audience**:

AxenAPI is designed for:
- **System Architects**: To design and visualize interactions between services and components.
- **Developers**: To implement microservices and message-driven systems.
- **Technical Writers/Analysts**: To generate documentation for stakeholders or clients.

---

### **Why Choose AxenAPI?**

- **Flexibility**: Supports various broker types and allows customization of JSON Schema.
- **Clarity**: Provides a visual representation of the system, making complex architectures easy to understand.
- **Convenience**: Simplifies workflows with features like inline editing, context menus, and export capabilities.
- **Documentation**: Enables seamless creation of professional, human-readable documentation for presentations or client reviews.

AxenAPI bridges the gap between system design and implementation, empowering users to efficiently manage distributed architectures while maintaining high standards of quality and usability.
