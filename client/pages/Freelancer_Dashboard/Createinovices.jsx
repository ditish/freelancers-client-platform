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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="glass-panel text-white p-6 rounded-xl w-full max-w-[400px]"
      >
        <h3 className="text-xl font-display font-bold mb-4">Create Invoice</h3>

        {/* Project */}
        <label className="block mb-2 text-sm text-white/70">Project</label>
        <select
          required
          className="w-full p-3 mb-4 rounded-lg glass-input [&>option]:text-black"
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
        <label className="block mb-2 text-sm text-white/70">Client</label>
        <input
          disabled
          className="w-full p-3 mb-4 rounded-lg glass-input opacity-60"
          value={selectedProject?.client?.name || ""}
        />

        {/* Amount */}
        <label className="block mb-2 text-sm text-white/70">Amount</label>
        <input
          type="number"
          required
          className="w-full p-3 mb-4 rounded-lg glass-input"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount:e.target.value })}
        />

        {/* Due Date */}
        <label className="block mb-2 text-sm text-white/70">Due Date</label>
        <input
          type="date"
          required
          className="w-full p-3 mb-4 rounded-lg glass-input"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate:e.target.value })}
        />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-white/60 hover:text-white transition-colors">Cancel</button>
          <button className="btn-accent px-4 py-2 rounded-lg">
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoiceModal;
