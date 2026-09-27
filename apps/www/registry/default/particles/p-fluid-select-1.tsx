"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/default/ui/fluid-select";

export default function Particle() {
  return (
    <>
      <Select defaultValue="viewer">
        <SelectTrigger />
        <SelectContent>
          <SelectItem index={0} value="viewer">
            Viewer
          </SelectItem>
          <SelectItem index={1} value="editor">
            Editor
          </SelectItem>
          <SelectItem index={2} value="admin">
            Admin
          </SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="editor" size="compact">
        <SelectTrigger />
        <SelectContent>
          <SelectItem index={0} value="viewer">
            Viewer
          </SelectItem>
          <SelectItem index={1} value="editor">
            Editor
          </SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="viewer" disabled>
        <SelectTrigger />
        <SelectContent>
          <SelectItem index={0} value="viewer">
            Viewer
          </SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
