import { For } from "solid-js";
import { Graph } from "@macrograph/core";

import { useCore } from "~/contexts";
import { useUIStore } from "~/UIStore";
import { GraphItem } from "./GraphItem";

// React component to show a list of projects
interface Props {
  onChange: (graph: Graph) => void;
}

export const GraphList = (props: Props) => {
  const core = useCore();
  const UI = useUIStore();

  return (
    <div class="flex flex-col flex-1">
      <div class="flex flex-row bg-neutral-900 text-white px-2 font-medium shadow">
        <div class="flex-1 py-1">Graphs</div>
        <button
          class="text-xl font-bold"
          onClick={() => {
            const graph = core.createGraph();
            UI.setCurrentGraph(graph);
          }}
        >
          +
        </button>
      </div>
      <For each={[...core.graphs.values()]}>
        {(graph) => (
          <GraphItem
            graph={graph}
            onClick={() => props.onChange(graph)}
            isCurrentGraph={graph === UI.state.currentGraph}
          />
        )}
      </For>
    </div>
  );
};
