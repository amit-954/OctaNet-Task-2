import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TodoList.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import UndoIcon from "@mui/icons-material/Undo";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const TodoList = () => {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		fetchTasks();
	}, []);

	const fetchTasks = async () => {
		try {
			const response = await axios.get("http://localhost:5000/tasks");
			setTasks(response.data);
		} catch (error) {
			console.error("Error fetching tasks:", error);
		}
	};

	const addTask = async () => {
		if (newTask.trim() === "") {
			setError("Task cannot be empty");
			return;
		}

		try {
			const response = await axios.post("http://localhost:5000/tasks", {
				text: newTask,
				completed: false,
			});
			setTasks([...tasks, response.data]);
			setNewTask("");
			setError("");
		} catch (error) {
			console.error("Error adding task:", error);
		}
	};

	const deleteTask = async (id) => {
		try {
			await axios.delete(`http://localhost:5000/tasks/${id}`);
			setTasks(tasks.filter((task) => task._id !== id));
		} catch (error) {
			console.error("Error deleting task:", error);
		}
	};

	const completeTask = async (task) => {
		try {
			const response = await axios.put(
				`http://localhost:5000/tasks/${task._id}`,
				{
					text: task.text,
					completed: !task.completed,
				},
			);
			setTasks(
				tasks.map((t) => (t._id === task._id ? response.data : t)),
			);
		} catch (error) {
			console.error("Error completing task:", error);
		}
	};

	return (
		<div className="container">
			<h1>ToDo List</h1>

			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					marginBottom: "10px",
				}}
			>
				<Stack spacing={2} direction="row">
					<div>
						<TextField
							id="outlined-size-small"
							size="small"
							label="Enter a Task"
							variant="outlined"
							type="text"
							value={newTask}
							onChange={(e) => setNewTask(e.target.value)}
							style={{ width: "270px" }}
							error={!!error}
							helperText={error}
						/>
					</div>

					<div>
						<Button
							variant="outlined"
							size="large"
							onClick={addTask}
						>
							{<AddCircleOutlineIcon />}
						</Button>
					</div>
				</Stack>
			</div>

			<div className="task-container">
				{tasks.map((task, index) => (
					<div
						key={task._id}
						className={`task-item ${
							task.completed ? "task-completed" : ""
						}`}
					>
						<Stack spacing={2} direction="row">
							<div className="task-number">
								<span>{index + 1}.</span>
							</div>
							<div className="task-name">
								<span
									style={{
										fontSize: "20px",
									}}
								>
									{task.text}
								</span>
							</div>
							<div className="task-button">
								<Stack spacing={2} direction="row">
									<Button
										color={!task.completed ? "success" : "warning"}
										variant="outlined"
										onClick={() => completeTask(task)}
									>
										{task.completed ? (
											<UndoIcon />
										) : (
											<TaskAltIcon />
										)}
									</Button>

									<Button
										color="error"
										variant="outlined"
										onClick={() => deleteTask(task._id)}
									>
										{<DeleteIcon />}
									</Button>
								</Stack>
							</div>
						</Stack>
					</div>
				))}
			</div>
		</div>
	);
};

export default TodoList;
