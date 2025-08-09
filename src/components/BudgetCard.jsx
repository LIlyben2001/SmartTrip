// src/components/BudgetCard.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export default function BudgetCard({ budget }) {
  if (!budget?.rows?.length) return null;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Estimated Budget</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1">Category</th>
              <th className="text-right py-1">Budget</th>
              <th className="text-right py-1">Mid-Range</th>
              <th className="text-right py-1">Luxury</th>
            </tr>
          </thead>
          <tbody>
            {budget.rows.map((row, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-1">{row.category}</td>
                <td className="text-right py-1">${row.budget}</td>
                <td className="text-right py-1">${row.mid}</td>
                <td className="text-right py-1">${row.luxury}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500 mt-4 italic">
          *Prices shown are estimates based on average costs for the destination. 
          Actual costs may vary depending on travel dates, accommodation, and local market conditions.
        </p>
      </CardContent>
    </Card>
  );
}
