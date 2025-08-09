// src/components/BudgetCard.jsx
import React from "react";
import { Card, CardContent } from "./ui/card";

export default function BudgetCard({ budget }) {
  if (!budget || !budget.rows || budget.rows.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-md">
      {/* Card Header */}
      <div className="px-6 pt-6 pb-2 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-bold text-gray-800">
          Estimated Trip Budget
        </h3>
      </div>

      <CardContent className="p-6">
        {/* Disclaimer */}
        <p className="text-xs text-gray-500 mb-4">
          * These amounts are rough estimates based on typical costs for budget,
          mid-range, and luxury travel. Prices are not in real-time and may vary
          depending on the season, destination, and booking choices.
        </p>

        {/* Budget Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Budget</th>
                <th className="px-4 py-2 border">Mid-Range</th>
                <th className="px-4 py-2 border">Luxury</th>
              </tr>
            </thead>
            <tbody>
              {budget.rows.map((row, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 border font-medium">{row.category}</td>
                  <td className="px-4 py-2 border">${row.budget}</td>
                  <td className="px-4 py-2 border">${row.mid}</td>
                  <td className="px-4 py-2 border">${row.luxury}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
