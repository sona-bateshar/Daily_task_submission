"use client";

import React, { useState, useEffect } from "react";

import { DataTable } from "@/components/data-table";

import data from "./data.json";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col w-full gap-6">
      <DataTable data={data} />
    </div>
  );
}
