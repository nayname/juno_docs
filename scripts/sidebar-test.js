(function () {
  document.addEventListener("DOMContentLoaded", function () {
    // -------- STATE --------
    let expanded = false;
    let firstAssistantShown = false;

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

    // -------- FUNCTIONS --------
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

    const addMsg = (role, text) => {
      const msg = document.createElement("div");
      msg.textContent = text;
      Object.assign(msg.style, {
        marginBottom: "6px",
        maxWidth: "90%",
        padding: "8px 10px",
        borderRadius: "10px",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
        fontSize: "13px",
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

    const addWorkflowDetails = () => {
      const details = document.createElement("details");
      details.open = false;
      Object.assign(details.style, {
        background: "#f9fafb",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "8px",
        margin: "6px 6px 10px 6px",
        fontSize: "12px",
        color: "#4a5568",
      });

      const summary = document.createElement("summary");
      summary.textContent = "View Workflow Details";
      Object.assign(summary.style, {
        cursor: "pointer",
        color: "#2b6cb0",
        fontWeight: "600",
        padding: "4px",
      });
      details.appendChild(summary);

      const container = document.createElement("div");
      container.style.padding = "6px";

      // Execution Level row
      const levelLabel = document.createElement("p");
      levelLabel.textContent = "Execution Level:";
      Object.assign(levelLabel.style, {
        margin: "4px 0 4px",
        fontWeight: "600",
        color: "#2d3748",
      });

      const levelSelect = document.createElement("select");
      Object.assign(levelSelect.style, {
        border: "1px solid #cbd5e0",
        borderRadius: "6px",
        padding: "4px 6px",
        fontSize: "12px",
        background: "#f8fafc",
      });
      ["Mock", "Read-only", "Testnet", "Mainnet"].forEach((opt) => {
        const o = document.createElement("option");
        o.text = opt;
        levelSelect.add(o);
      });

      // Steps blocks
      const makeStep = (title, content, dark = false) => {
        const t = document.createElement("p");
        t.textContent = title;
        Object.assign(t.style, {
          margin: "8px 0 4px",
          fontWeight: "600",
          color: "#4a5568",
        });
        const pre = document.createElement("pre");
        pre.textContent = content;
        Object.assign(pre.style, {
          margin: "0 0 6px 0",
          padding: "8px",
          borderRadius: "6px",
          overflowX: "auto",
          whiteSpace: "pre-wrap",
          background: dark ? "#1a202c" : "#f3f4f6",
          color: dark ? "#f7fafc" : "#111827",
        });
        container.appendChild(t);
        container.appendChild(pre);
      };

      container.appendChild(levelLabel);
      container.appendChild(levelSelect);

      makeStep(
        "Step 1: Collect Input Parameters",
        "> Gathering user inputs and validating schema...\n✅ Input validated successfully.",
        true
      );

      makeStep(
        "Step 2: Generate Execution Plan",
        `{
  "action": "execute",
  "target": "cosmwasm_contract",
  "parameters": {
    "amount": "3 eBTC",
    "destination": "vault"
  }
}`
      );

      makeStep(
        "Step 3: Mock Execution Output",
        "> Simulating transaction...\n✔️ Response: success\nTx hash: mock_tx_ABC123",
        true
      );

      details.appendChild(container);
      chatArea.appendChild(details);
      chatArea.scrollTop = chatArea.scrollHeight;
    };

    // Submit flow
    footer.onsubmit = (e) => {
      e.preventDefault();
      const val = footerInput.value.trim();
      if (!val) return;
      if (placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
      addMsg("user", val);
      footerInput.value = "";
      setTimeout(() => {
        addMsg(
          "assistant",
          "Mock execution complete ✅\nTx hash: mock_tx_ABC123\n(Details below)"
        );
        if (!firstAssistantShown) {
          addWorkflowDetails();
          firstAssistantShown = true;
          // Once assistant responded, we can keep or hide suggestions:
          // suggestionsWrap.style.display = "none"; // uncomment to hide
        } else {
          addWorkflowDetails();
        }
      }, 650);
    };

    // Mount sidebar
    document.body.appendChild(sidebar);

    // Start expanded if user focuses/clicks
    input.addEventListener("focus", expandSidebar);
    icon.addEventListener("click", expandSidebar);
    chatString.addEventListener("click", () => input.focus());
  });
})();
