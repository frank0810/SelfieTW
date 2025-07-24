import React, {useEffect} from 'react';
import { ListGroup, Row, Col } from 'react-bootstrap';
import SingleTaskComponent from './SingleTaskComponent';
import { useTimeMachine } from '../../TimeMachineContext';

const TaskListComponent = ({ tasks, fetchTasks }) => {
  const { virtualTime } = useTimeMachine();
  useEffect(() => {
}, [virtualTime]);
  return (
    <div className="text-center">
      <h2 className="mb-4">Attività</h2>
      <ListGroup className="w-75 mx-auto">
        <ListGroup.Item className="text-center bg-primary text-white">
          <Row>
            <Col>Titolo</Col>
            <Col>Data di Scadenza</Col>
            <Col>Stato</Col>
            <Col></Col>
            <Col></Col>
          </Row>
        </ListGroup.Item>
        {tasks.map((task) => (
          <SingleTaskComponent key={task._id} task={task} fetchTasks={fetchTasks} virtualTime={virtualTime} />
        ))}
      </ListGroup>
    </div>
  );
};

export default TaskListComponent;


// import React, { useEffect } from 'react';
// import { ListGroup, Row, Col } from 'react-bootstrap';
// import SingleTaskComponent from './SingleTaskComponent';
// import { useTimeMachine } from '../../TimeMachineContext';

// const TaskListComponent = ({ tasks, fetchTasks, onEditTask }) => {
//   const { virtualTime } = useTimeMachine();
  
//   const truncateTitle = (title, maxLength = 15) => {
//     return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
//   };

//   const getTaskStatusColor = (task) => {
//     const currentDate = new Date(virtualTime || new Date());
//     const dueDate = new Date(task.dueDate);
    
//     if (task.completed) {
//       return '#28a745'; 
//     } else if (dueDate < currentDate) {
//       return '#dc3545'; 
//     } else {
//       return '#ffc107'; 
//     }
//   };

//   const formatDueDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('it-IT', {
//       day: '2-digit',
//       month: '2-digit',
//       year: '2-digit'
//     });
//   };

//   useEffect(() => {}, [virtualTime]);

//   return (
//     <div className="text-center">
//       <h2 className="mb-4">Attività</h2>
//       <ListGroup className="w-75 mx-auto">
//         <ListGroup.Item className="text-center bg-primary text-white d-none d-md-block">
//           <Row>
//             <Col>Titolo</Col>
//             <Col>Data di Scadenza</Col>
//             <Col>Stato</Col>
//             <Col></Col>
//             <Col></Col>
//           </Row>
//         </ListGroup.Item>
        
//         {tasks.map((task) => (
//           <ListGroup.Item key={task._id}>
//             <div className="d-none d-md-block">
//               <SingleTaskComponent 
//                 task={task} 
//                 fetchTasks={fetchTasks} 
//                 virtualTime={virtualTime} 
//               />
//             </div>
            
//             {/* Mobile View */}
//             <div className="d-md-none">
//               <div className="d-flex justify-content-between align-items-center">
//                 <div className="flex-grow-1 d-flex align-items-center">
//                  <div 
//                     className="rounded-circle me-2"
//                     style={{
//                       width: '12px',
//                       height: '12px',
//                       backgroundColor: getTaskStatusColor(task),
//                       minWidth: '12px'
//                     }}
//                   ></div>
                  
//                   <div className="flex-grow-1">
//                     <div className="fw-bold text-start">
//                       {truncateTitle(task.title)}
//                     </div>
//                     <div className="text-muted small text-start">
//                       Scadenza: {formatDueDate(task.dueDate)}
//                     </div>
//                   </div>
//                 </div>
                
//                 <button 
//                   className="btn btn-link p-0 ms-2"
//                   onClick={() => onEditTask && onEditTask(task)}
//                   style={{ fontSize: '1.2em' }}
//                 >
//                   ✏️
//                 </button>
//               </div>
//             </div>
//           </ListGroup.Item>
//         ))}
//       </ListGroup>
//     </div>
//   );
// };

// export default TaskListComponent;