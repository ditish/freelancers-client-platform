import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../src/features/Project/projectSlice";

import { createInvoice } from "../../src/features/invoice/invoiceSlice";
import axios from "axios";

const CreateInvoiceModal = ({ onClose }) => {
  const invoiceNumber = `INV-${Date.now()}`; 
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projects);

  const [form, setForm] = useState({
    project:"",
    amount: "",
    dueDate: ""
  });

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);
  
  
  
  
  const selectedProject = projects.find(p => p._id === form.project);
  const selectedClient = selectedProject?.client || null;
  console.log("this is selcted client",selectedClient)

  
  console.log("this is project1",form.project)
  const handleSubmit =  async (e) => {
    e.preventDefault();
 
    dispatch(createInvoice({
      invoiceNumber,
      selectedClient,
      Project: form.project,
      amount: form.amount,
      dueDate: form.dueDate,
    }));

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg w-[400px]"
      >
        <h3 className="text-xl font-bold mb-4">Create Invoice</h3>

        {/* Project */}
        <label className="block mb-2">Project</label>
        <select
          required
          className="w-full border p-2 mb-4"
          value={form.project}
          onChange={(e) => setForm({ ...form, project: e.target.value })}
        >
          <option value="">Select project</option>
          {projects.map(p => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </select>

        {/* Client (auto) */}
        <label className="block mb-2">Client</label>
        <input
          disabled
          className="w-full border p-2 mb-4 bg-gray-100"
          value={selectedProject?.client?.name || ""}
        />

        {/* Amount */}
        <label className="block mb-2">Amount</label>
        <input
          type="number"
          required
          className="w-full border p-2 mb-4"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount:e.target.value })}
        />

        {/* Due Date */}
        <label className="block mb-2">Due Date</label>
        <input
          type="date"
          required
          className="w-full border p-2 mb-4"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate:e.target.value })}
        />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose}>Cancel</button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded">
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoiceModal;
