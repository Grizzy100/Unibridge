"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Label } from "../../../../components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const universities = [
  "Indian Institute of Technology Bombay",
  "Indian Institute of Technology Delhi",
  "Indian Institute of Science Bangalore",
  "University of Mumbai",
  "Banaras Hindu University",
  "Amity University",
  "Lovely Professional University",
  "SRM Institute of Science and Technology",
  "Vellore Institute of Technology",
  "Delhi University",
  "Manipal University",
  "Bennett University",
  "Ashoka University",
  "O.P. Jindal Global University",
];

export default function UniversityPage() {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const router = useRouter();

  const handleChange = (value: string) => {
    setQuery(value);
    setSelected("");
    if (value.trim() === "") {
      setFiltered([]);
    } else {
      const results = universities.filter((uni) =>
        uni.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(results);
    }
  };

  const handleSelect = (uni: string) => {
    setQuery(uni);
    setSelected(uni);
    setFiltered([]);
  };

  const handleNext = () => {
    // You can store the selected university in localStorage or context if needed
    router.push("/student-login");
  };

  return (
    <div className="w-full max-w-md mx-auto mt-24">
      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-gray-800">
            Select Your University
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="university" className="text-gray-700">
              Search University
            </Label>
            <div className="relative mt-2">
              <Input
                id="university"
                type="text"
                placeholder="Type to search..."
                value={query}
                onChange={(e) => handleChange(e.target.value)}
                className="pr-10"
              />
              <FaChevronDown className="absolute right-3 top-3.5 text-gray-400" />

              {/* Dropdown suggestions */}
              <AnimatePresence>
                {filtered.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-56 overflow-y-auto"
                  >
                    {filtered.map((uni, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleSelect(uni)}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        {uni}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>

          <Button
            onClick={handleNext}
            disabled={!selected}
            className={`w-full text-white transition-all ${
              selected
                ? "bg-black/60 hover:bg-black"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Next
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
