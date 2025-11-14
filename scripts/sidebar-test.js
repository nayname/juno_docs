(function () {
  document.addEventListener("DOMContentLoaded", function () {
    // -------- STATE --------
    let expanded = false;
    let firstAssistantShown = false;

      async function sendToBackend(userText) {
          try {
              const response = await fetch("https://api.thousandmonkeystypewriter.org/chat", {
                  method: "POST", headers: {
                      "Content-Type": "application/json",
                  }, body: JSON.stringify({query: userText}),
              });

              if (!response.ok) {
                  throw new Error("Bad backend response: " + response.status);
              }

              return await response.json();
          } catch (err) {
              console.error("Backend error:", err);
              return {
                  mode: "error", message: "❌ Error contacting backend: " + err.message,
              };
          }

          // return {
          //     "mode": "mixed",
          //     "answer": "this is a test answer",
          //     "workflow": {
          //         "steps": [
          //             {"title": "✅ Mock execution complete.\nTx: mock_tx_ABC123"},
          //             {"title": "🔄 Running mock execution…"}
          //         ]
          //     }
          // }
      }
    // -------- COLLAPSED CHAT STRING --------
    const chatString = document.createElement("div");
    chatString.id = "chat-string";
    Object.assign(chatString.style, {
      position: "fixed",
      top: "110px",
      right: "40px",
      width: "420px",
      borderRadius: "9999px",
      background: "#ffffff",
      border: "1px solid #d1d5db",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 16px",
      cursor: "text",
      zIndex: "2147483647",
      transition: "all 0.3s ease",
    });

    const input = document.createElement("input");
    input.placeholder = "Describe what you want to execute…";
    Object.assign(input.style, {
      flex: "1",
      border: "none",
      outline: "none",
      fontSize: "14px",
      color: "#374151",
      background: "transparent",
    });

    const icon = document.createElement("span");
    icon.textContent = "➤";
    Object.assign(icon.style, {
      color: "#2f855a",
      fontWeight: "bold",
      cursor: "pointer",
      userSelect: "none",
    });

    chatString.appendChild(input);
    chatString.appendChild(icon);
    document.body.appendChild(chatString);

    // -------- EXPANDED SIDEBAR --------
    const sidebar = document.createElement("div");
    Object.assign(sidebar.style, {
      position: "fixed",
      top: "80px",
      right: "0",
      width: "440px",
      height: "calc(100vh - 80px)",
      background: "#fff",
      borderLeft: "1px solid #ddd",
      boxShadow: "-4px 0 12px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease",
      zIndex: "2147483646",
      fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    });

    // Header
    const header = document.createElement("div");
    Object.assign(header.style, {
      padding: "12px 16px",
      borderBottom: "1px solid #e5e7eb",
      background: "#f9fafb",
      fontWeight: "600",
      color: "#111827",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "14px",
    });
    header.textContent = "Natural Language Execution Module";

    const closeBtn = document.createElement("span");
    closeBtn.textContent = "✕";
    closeBtn.style.cursor = "pointer";
    closeBtn.onclick = () => collapseSidebar();
    header.appendChild(closeBtn);
    sidebar.appendChild(header);

    // Chat area
    const chatArea = document.createElement("div");
    Object.assign(chatArea.style, {
      flex: "1",
      overflowY: "auto",
      padding: "16px",
      fontSize: "13px",
      color: "#2d3748",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    });
    const placeholder = document.createElement("div");
    placeholder.textContent = "Describe what you want to ask or execute...";
    Object.assign(placeholder.style, {
      textAlign: "center",
      color: "#a0aec0",
      marginTop: "40%",
    });
    chatArea.appendChild(placeholder);
    sidebar.appendChild(chatArea);

    // Suggestions (visible when no assistant response yet)
    const suggestionsWrap = document.createElement("div");
    Object.assign(suggestionsWrap.style, {
      borderTop: "1px solid #e2e8f0",
      padding: "10px 16px",
      background: "#f7faf7",
    });
    const suggestionsLabel = document.createElement("p");
    suggestionsLabel.textContent = "Suggestions";
    Object.assign(suggestionsLabel.style, {
      fontSize: "13px",
      fontWeight: "600",
      color: "#2d3748",
      margin: "0 0 6px 0",
    });
    suggestionsWrap.appendChild(suggestionsLabel);

    const makeSugBtn = (text) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = text;
      Object.assign(btn.style, {
        display: "block",
        width: "100%",
        textAlign: "left",
        color: "#2f855a",
        background: "none",
        border: "none",
        fontSize: "13px",
        cursor: "pointer",
        padding: "4px 0",
      });
      btn.onmouseover = () => (btn.style.textDecoration = "underline");
      btn.onmouseout = () => (btn.style.textDecoration = "none");
      btn.onclick = () => {
        footerInput.value = text;
        footerInput.focus();
      };
      return btn;
    };

    [
      "Query a wallet’s bank balances via the REST API",
      "Broadcast a pre-signed transaction over gRPC",
      "Collect all gentxs into the genesis file",
      "Set mempool max-txs to -1 in app.toml",
      "Allow p2p port 26656 through ufw",
    ].forEach((s) => suggestionsWrap.appendChild(makeSugBtn(s)));

    // Footer input
    const footer = document.createElement("form");
    Object.assign(footer.style, {
      borderTop: "1px solid #e2e2e2",
      padding: "10px",
      display: "flex",
      gap: "6px",
      alignItems: "center",
      background: "#fff",
    });

    const footerInput = document.createElement("input");
    footerInput.placeholder =
      "Describe what you want to execute (e.g., deposit 3 eBTC, query vault balance…)";
    Object.assign(footerInput.style, {
      flex: "1",
      border: "1px solid #cbd5e0",
      borderRadius: "8px",
      padding: "10px 12px",
      fontSize: "13px",
      outline: "none",
    });

    const execBtn = document.createElement("button");
    execBtn.type = "submit";
    execBtn.textContent = "Execute";
    Object.assign(execBtn.style, {
      background: "#2f855a",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "10px 14px",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "600",
    });

    footer.appendChild(footerInput);
    footer.appendChild(execBtn);

    // Compose sidebar (order matters)
    sidebar.appendChild(suggestionsWrap);
    sidebar.appendChild(footer);
    document.body.appendChild(sidebar);


    // ========= expand/collapse =========
    const expandSidebar = () => {
      expanded = true;
      sidebar.style.transform = "translateX(0)";
      chatString.style.opacity = "0";
      setTimeout(() => (chatString.style.display = "none"), 300);
      // focus footer input for immediate typing
      setTimeout(() => footerInput.focus(), 120);
    };

    const collapseSidebar = () => {
      expanded = false;
      sidebar.style.transform = "translateX(100%)";
      chatString.style.display = "flex";
      setTimeout(() => (chatString.style.opacity = "1"), 100);
    };

    input.addEventListener("focus", expandSidebar);
    icon.addEventListener("click", expandSidebar);
    chatString.addEventListener("click", () => input.focus());


    // ========= message utility ===========
      const addMsg = (role, htmlText) => {
          const msg = document.createElement("div");

          // 👇 CRITICAL FIX — RENDER HTML
          msg.innerHTML = htmlText;

          Object.assign(msg.style, {
              marginBottom: "6px",
              maxWidth: "90%",
              padding: "8px 10px",
              borderRadius: "10px",
              fontSize: "13px",
              whiteSpace: "normal",     // allow HTML wrapping
              wordBreak: "break-word",
          });

          if (role === "user") {
              msg.style.background = "#dcfce7";
              msg.style.marginLeft = "auto";
          } else {
              msg.style.background = "#edf2f7";
          }

          chatArea.appendChild(msg);
          chatArea.scrollTop = chatArea.scrollHeight;
      };

      // ========= workflow preview ===========
      const renderWorkflow = (workflowArray, recipeTitle) => {
          const container = document.createElement("div");
          Object.assign(container.style, {
              background: "#f9fafb",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "12px",
              margin: "6px 6px 10px 6px",
              fontSize: "12px",
              color: "#374151",
          });

          // Recipe title
          if (recipeTitle) {
              const title = document.createElement("div");
              title.textContent = recipeTitle;
              Object.assign(title.style, {
                  fontWeight: "600",
                  fontSize: "14px",
                  marginBottom: "6px"
              });
              container.appendChild(title);
          }

          // Steps
          workflowArray.forEach((step, idx) => {
              const stepBox = document.createElement("details");
              stepBox.style.marginBottom = "6px";

              const summary = document.createElement("summary");
              summary.textContent = `Step ${idx + 1}: ${step.tool || "Unnamed tool"}`;
              Object.assign(summary.style, {
                  cursor: "pointer",
                  fontWeight: "600",
                  color: "#2b6cb0"
              });

              stepBox.appendChild(summary);

              const inner = document.createElement("div");
              inner.style.padding = "6px 0";

              // Description
              if (step.description) {
                  const desc = document.createElement("p");
                  desc.textContent = step.description;
                  Object.assign(desc.style, {
                      marginBottom: "4px",
                      fontSize: "12px"
                  });
                  inner.appendChild(desc);
              }

              // Type / function metadata
              if (step.type || step.function) {
                  const meta = document.createElement("p");
                  meta.style.fontSize = "12px";
                  meta.style.color = "#6b7280";
                  meta.textContent = `${step.type || ""} ${step.function ? "• " + step.function : ""}`;
                  inner.appendChild(meta);
              }

              // Code block
              if (step.code) {
                  const codeBlock = document.createElement("pre");
                  codeBlock.textContent = step.code;
                  Object.assign(codeBlock.style, {
                      background: "#1a202c",
                      color: "#f7fafc",
                      padding: "8px",
                      borderRadius: "6px",
                      whiteSpace: "pre-wrap",
                      overflowX: "auto",
                      fontSize: "11px"
                  });
                  inner.appendChild(codeBlock);
              }

              stepBox.appendChild(inner);
              const wrapper = document.createElement("div");
              wrapper.className = "step-wrapper";
              wrapper.style.marginBottom = "8px";
              wrapper.appendChild(stepBox);
              container.appendChild(wrapper);
          });

          // Execution Level + Buttons
          const controls = document.createElement("div");
          Object.assign(controls.style, {
              marginTop: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "6px"
          });

          // // Level Dropdown
          // const select = document.createElement("select");
          // ["Mock", "Read-only", "Testnet", "Mainnet"].forEach(opt => {
          //     const o = document.createElement("option");
          //     o.value = opt.toLowerCase();
          //     o.text = opt;
          //     select.add(o);
          // });
          // Object.assign(select.style, {
          //     border: "1px solid #cbd5e0",
          //     padding: "6px",
          //     borderRadius: "6px",
          // });
          // controls.appendChild(select);

          // Mock Execute
          const mockBtn = document.createElement("button");
          mockBtn.textContent = "Mock Execute";
          Object.assign(mockBtn.style, {
              padding: "8px",
              background: "#2f855a",
              color: "#fff",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer"
          });
          mockBtn.onclick = async () => {
              // Assistant message
              addMsg("assistant", "🔄 Sending workflow to backend…");

              // ---- 1. POST the workflow array ----
              let result;
              try {
                  const response = await fetch("https://api.thousandmonkeystypewriter.org/mock_execute", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ workflow: workflowArray })
                  });

                  if (!response.ok) {
                      throw new Error("Backend mock execution failed with status " + response.status);
                  }

                  result = await response.json();
              } catch (err) {
                  console.error("[mockBtn] Request error:", err);
                  addMsg("assistant", "❌ Mock execute failed: " + err.message);
                  return;
              }

              // ---- 2. Validate format ----
              if (!result || !Array.isArray(result.step_results)) {
                  addMsg("assistant", "❌ Invalid mock response: missing step_results[]");
                  return;
              }

              addMsg("assistant", "✅ Mock results received. Populating steps…");

              // ---- 3. Insert each step result under its wrapper ----
              const detailsNodes = container.querySelectorAll("details");

              result.step_results.forEach((stepResult, idx) => {
                  const detailsEl = detailsNodes[idx];
                  if (!detailsEl) return;

                  // The wrapper is the parent of <details>
                  const wrapper = detailsEl.parentElement;

                  // If wrapper is missing, abort
                  if (!wrapper) return;

                  // Remove previous mock output inside the wrapper
                  let existing = wrapper.querySelector(".mock-output");
                  if (existing) existing.remove();

                  // Create new mock output block
                  const outputEl = document.createElement("pre");
                  outputEl.className = "mock-output";
                  Object.assign(outputEl.style, {
                      background: "#fefcbf",
                      color: "#1a202c",
                      padding: "6px",
                      margin: "4px 0 6px 16px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      border: "1px solid #ecc94b",
                      whiteSpace: "pre-wrap",
                      overflowX: "auto",
                  });

                  outputEl.textContent = stepResult.output || stepResult.error || "No output from backend.";

                  // Append AFTER <details>, so it remains visible even when collapsed
                  wrapper.appendChild(outputEl);
              });

              addMsg("assistant", "📘 Mock execution complete. Outputs are visible under each step.");
          };
          controls.appendChild(mockBtn);

          // Open Playground
          const playBtn = document.createElement("button");
          playBtn.textContent = "Open Playground";
          Object.assign(playBtn.style, {
              padding: "8px",
              background: "#3b82f6",
              color: "#fff",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer"
          });
          playBtn.onclick = () => window.location.href = "/playground.html";
          controls.appendChild(playBtn);

          container.appendChild(controls);
          chatArea.appendChild(container);
          chatArea.scrollTop = chatArea.scrollHeight;
      };

      // ========= main submit ===========
      footer.onsubmit = async (e) => {
          e.preventDefault();
          const text = footerInput.value.trim();
          if (!text) return;
          footerInput.value = "";

          if (placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);

          addMsg("user", text);

          // Show "thinking" placeholder
          const thinking = document.createElement("div");
          thinking.textContent = "Thinking…";
          Object.assign(thinking.style, {
              padding: "8px 10px",
              borderRadius: "10px",
              background: "#f3f4f6",
              maxWidth: "90%",
              fontSize: "13px",
          });
          chatArea.appendChild(thinking);

          const result = await sendToBackend(text);

          thinking.remove();

          // ===== Branching logic =====
          if (result.mode === "error") {
              addMsg("assistant", result.message);
              return;
          }

          if (result.mode === "answer") {
              addMsg("assistant", result.answer);
              return;
          }

          if (result.mode === "workflow") {
              addMsg("assistant", "⚙️ Executable workflow detected:");
              renderWorkflow(result.workflow);
              return;
          }

          if (result.mode === "mixed") {
              if (result.answer) addMsg("assistant", result.answer);
              if (result.workflow) {
                  addMsg("assistant", "⚙️ Execution plan:");
                  renderWorkflow(result.workflow);
              }
              return;
          }

          // fallback
          addMsg("assistant", "❓ Unexpected backend format.");
      };
  });
})();

