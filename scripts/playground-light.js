(function () {
    document.addEventListener("DOMContentLoaded", function () {
        // ---------- ROOT CONTAINER ----------
        const root = document.createElement("div");
        root.id = "playground-root";
        Object.assign(root.style, {
            display: "flex",
            width: "100%",
            height: "calc(100vh - 6rem)",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            background: "#fff",
            fontFamily: "Inter, system-ui, sans-serif",
        });

        // ---------- LEFT SNIPPETS ----------
        const sidebar = document.createElement("div");
        Object.assign(sidebar.style, {
            width: "35%",
            background: "#f9fafb",
            borderRight: "1px solid #e5e7eb",
            overflowY: "auto",
            padding: "16px",
        });

        const sidebarTitle = document.createElement("h3");
        sidebarTitle.textContent = "📘 Code Snippets";
        Object.assign(sidebarTitle.style, {
            fontWeight: "600",
            color: "#1a202c",
            fontSize: "14px",
            marginBottom: "8px",
        });
        sidebar.appendChild(sidebarTitle);

        const snippetsWrap = document.createElement("div");
        sidebar.appendChild(snippetsWrap);

        const loadingMsg = document.createElement("p");
        loadingMsg.textContent = "Loading snippets...";
        Object.assign(loadingMsg.style, {
            fontSize: "12px",
            color: "#6b7280",
        });
        snippetsWrap.appendChild(loadingMsg);

        // Load snippets from example Cosmos docs page
        // Replace the fetch(...) block entirely with:
        const exampleSnippets = [
            "neutrond tx wasm execute ...",
            "neutrond query bank balances cosmos1...",
            "andromedad tx app instantiate ...",
            "valenced tx custom execute ..."
        ];

        snippetsWrap.innerHTML = "";
        exampleSnippets.forEach((code) => {
            const pre = document.createElement("pre");
            pre.textContent = code;
            Object.assign(pre.style, {
                background: "#1a202c",
                color: "#a7f3d0",
                fontSize: "12px",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "10px",
                cursor: "pointer",
                whiteSpace: "pre-wrap",
            });
            pre.addEventListener("click", () => {
                input.value = code;
                input.focus();
            });
            snippetsWrap.appendChild(pre);
        });


        // ---------- RIGHT CHAT PANE ----------
        const chatPane = document.createElement("div");
        Object.assign(chatPane.style, {
            flex: "1",
            display: "flex",
            flexDirection: "column",
            background: "#ffffff",
        });

        const chatLog = document.createElement("div");
        Object.assign(chatLog.style, {
            flex: "1",
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            fontSize: "13px",
        });

        const welcome = document.createElement("div");
        welcome.textContent =
            "👋 Welcome! Select a snippet or type an intent to start executing.";
        Object.assign(welcome.style, {
            background: "#f3f4f6",
            padding: "10px 12px",
            borderRadius: "8px",
            maxWidth: "80%",
            color: "#374151",
        });
        chatLog.appendChild(welcome);

        chatPane.appendChild(chatLog);

        // ---------- INPUT AREA ----------
        const inputBar = document.createElement("div");
        Object.assign(inputBar.style, {
            borderTop: "1px solid #e5e7eb",
            padding: "12px",
            display: "flex",
            gap: "8px",
            alignItems: "center",
        });

        const input = document.createElement("textarea");
        input.rows = 2;
        input.placeholder =
            "Describe what you want to execute (e.g., query bank balances, deploy contract...)";
        Object.assign(input.style, {
            flex: "1",
            border: "1px solid #d1d5db",
            borderRadius: "10px",
            padding: "8px 10px",
            resize: "none",
            fontSize: "13px",
            outline: "none",
            fontFamily: "monospace",
        });

        const sendBtn = document.createElement("button");
        sendBtn.textContent = "Send";
        Object.assign(sendBtn.style, {
            background: "#2f855a",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
        });

        inputBar.appendChild(input);
        inputBar.appendChild(sendBtn);
        chatPane.appendChild(inputBar);

        // ---------- MESSAGE HELPERS ----------
        function addMsg(role, text) {
            const msg = document.createElement("div");
            msg.textContent = text;
            Object.assign(msg.style, {
                padding: "10px 12px",
                borderRadius: "12px",
                maxWidth: "80%",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                alignSelf: role === "user" ? "flex-end" : "flex-start",
                background: role === "user" ? "#dcfce7" : "#f3f4f6",
                color: "#111827",
            });
            chatLog.appendChild(msg);
            chatLog.scrollTop = chatLog.scrollHeight;
        }

        // ---------- MOCK SEND ----------
        let loading = false;
        function handleSend() {
            if (loading) return;
            const val = input.value.trim();
            if (!val) return;
            addMsg("user", val);
            input.value = "";
            loading = true;
            sendBtn.disabled = true;
            sendBtn.textContent = "Running...";
            setTimeout(() => {
                addMsg("assistant", "✅ Executed successfully (mock response).");
                loading = false;
                sendBtn.disabled = false;
                sendBtn.textContent = "Send";
            }, 900);
        }

        sendBtn.addEventListener("click", handleSend);
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        });

        // ---------- COMPOSE PAGE ----------
        root.appendChild(sidebar);
        root.appendChild(chatPane);
        document.body.appendChild(root);
    });
})();
