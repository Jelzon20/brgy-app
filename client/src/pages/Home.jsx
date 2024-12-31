import React from 'react'
import { Button } from 'flowbite-react';
import GenderCharts from "../charts/GenderCharts";

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white w-56 p-6 rounded-lg shadow">
        <GenderCharts />
      </div>

    </div>
  )
}
