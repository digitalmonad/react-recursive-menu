import React from "react";
import {
  FolderIcon,
  FileIcon,
  ChevronRightIcon,
  FolderOpenIcon,
  ChevronDownIcon,
} from "lucide-react";

function App() {
  const [tree, setTree] = React.useState<Node[]>([
    {
      label: "/root",
      nodes: [
        {
          label: "Source codes",
          nodes: [{ label: "script.js", isSelected: false }],
        },
        {
          label: "Music",
          nodes: [
            { label: "Alice in Chains - Rooster.mp3", isSelected: false },
            { label: "Miley Cyrus - Party in The USA.mp3", isSelected: false },
            { label: "Tool - Schism.mp3", isSelected: false },
          ],
        },
        {
          label: "Photos",
          nodes: [
            { label: "family-reunion.png", isSelected: false },
            { label: "holiday-2023.png", isSelected: false },
            { label: "summer-trip-2023.jpg", isSelected: false },
            { label: "fb-avatar.jpeg", isSelected: false },
          ],
        },
      ],
      isSelected: false,
    },
  ]);

  const handleSelect = (label: string, isSelected: boolean) => {
    const updateTree = (nodes: Node[]): Node[] =>
      nodes.map((node) => {
        if (node.label === label) {
          return { ...node, isSelected: !isSelected };
        }
        if (node.nodes) {
          return { ...node, nodes: updateTree(node.nodes) };
        }
        return node;
      });

    setTree(updateTree(tree));
  };

  const getSelectedItems = (nodes: Node[]): string[] => {
    let selectedItems: string[] = [];
    nodes.forEach((node) => {
      if (node.isSelected) {
        selectedItems.push(node.label);
      }
      if (node.nodes) {
        selectedItems = [...selectedItems, ...getSelectedItems(node.nodes)];
      }
    });
    return selectedItems;
  };

  const selectedItems = getSelectedItems(tree);

  return (
    <div className="flex p-8">
      <div className="flex w-full gap-4 m-auto">
        <div className="border rounded-sm flex-1 p-4">
          {tree.map((node) => (
            <Node key={node.label} node={node} onSelect={handleSelect} />
          ))}
        </div>
        <div className="border rounded-sm flex-1 p-4">
          Selected items:
          {selectedItems.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

type Node = {
  label: string;
  isSelected?: boolean;
  nodes?: Node[];
};

function Node({
  node,
  onSelect,
}: {
  node: Node;
  onSelect: (label: string, isSelected: boolean) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node.label, !!node.isSelected);
  };
  return (
    <ul>
      <li className="my-1.5 pl-6" key={node.label}>
        <div
          className={`rounded-md px-2 transition-colors hover:bg-gray-900 flex gap-1.5 items-center ${
            !!node.nodes && "cursor-pointer"
          }`}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {!!node.nodes?.length &&
            (isOpen ? (
              <ChevronDownIcon className="size-4 text-gray-500" />
            ) : (
              <ChevronRightIcon className="size-4 text-gray-500" />
            ))}

          {node.nodes ? (
            isOpen ? (
              <FolderOpenIcon className="size-4 text-teal-300" />
            ) : (
              <FolderIcon className="size-4 text-teal-300" />
            )
          ) : (
            <>
              <input
                onClick={handleCheckboxClick}
                type="checkbox"
                className="accent-gray-900 invert checked:invert-0"
              />
              <FileIcon className="size-4 text-teal-300 " />
            </>
          )}
          <span className="select-none">{node.label}</span>
        </div>

        {isOpen &&
          node.nodes?.map((node) => (
            <Node {...{ node }} key={node.label} onSelect={onSelect} />
          ))}
      </li>
    </ul>
  );
}

export default App;
