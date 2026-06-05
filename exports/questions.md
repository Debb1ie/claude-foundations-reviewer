# CCA-F Question Bank
> Claude Certified Architect — Foundations Exam
> Exported on 2026-06-05
> Total Questions: 125

---

## D1: Agentic Architecture & Orchestration (33 questions)

### q001 — Task 1.1

**Scenario:** The agent checks stop_reason after each API response and appends tool results between iterations. Analysis shows inconsistent loop termination behavior.

**Question:** A team builds a customer support agent that processes multi-step refund requests by calling verification tools, refund tools, and notification tools in sequence. During testing, the agent occasionally terminates its loop after a single verification call and presents a final response before the refund is processed. Which design change would most directly resolve this reliability issue?

**Options:**

A. **[✓]** Check stop_reason after each API response, continue on tool_use, and terminate on end_turn with each tool result appended between iterations

B. Enforce a fixed minimum of three tool-use iterations before the agent is permitted to present any final response to the customer

C. Parse the assistant natural language output for completion phrases like the issue is resolved to determine when the task is finished

D. Pre-configure a deterministic tool sequence that runs verification refund and notification tools in a fixed order on every request

**Correct Answer:** A

**Explanation:** The correct approach is to check the stop_reason field in the API response. When stop_reason is end_turn, the model has finished and is not requesting any tool calls. When it is tool_use, the model is requesting to call a tool and the loop should continue. Fixed iteration counts or content length heuristics are brittle and do not reflect the model's actual state.

**Source:** Exam Guide Ã‚Â§Task 1.1

---

### q002 — Task 1.2

**Scenario:** A code review agent calls a static analysis tool and receives findings. You need to structure the next API request so the model can reason about the results.

**Question:** In an agentic workflow, a tool returns results that need to be fed back to the model. What is the correct way to provide tool results back to the model in the conversation history?

**Options:**

A. Append the tool result as a new user message with a returned prefix

B. **[✓]** Append the tool result as a tool_result block within the same assistant turn

C. Create a new system message that contains the complete tool output data

D. Attach the tool result as metadata outside the standard messages array entirely

**Correct Answer:** B

**Explanation:** Tool results must be appended as a tool_result content block within the same turn as the assistant message that issued the tool_use. This maintains the correct turn structure and allows the model to correlate the result with the specific tool call. Appending as user messages breaks the conversation structure and can confuse the model's understanding of who said what.

**Source:** Exam Guide Ã‚Â§Task 1.2

---

### q003 — Task 1.3

**Scenario:** You are designing a market research system where three specialists (competitor analysis, customer sentiment, pricing trends) can operate independently.

**Question:** A coordinator agent needs to execute three independent research tasks in parallel using subagents. What is the correct architectural approach?

**Options:**

A. Execute all tasks sequentially in a single loop for context coherence

B. Spawn an additional supervisor agent to coordinate the three subagents

C. Use a single subagent that handles all three research concerns sequentially

D. **[✓]** Issue multiple Task tool calls within a single coordinator response

**Correct Answer:** D

**Explanation:** Parallel subagent execution is achieved by issuing multiple Task tool calls in a single coordinator response. Each Task invocation spawns an independent subagent that runs concurrently. This is far more efficient than sequential execution when tasks have no dependencies. The coordinator should then collect and synthesize results after all parallel tasks complete.

**Source:** Exam Guide Ã‚Â§Task 1.3

---

### q004 — Task 1.4

**Scenario:** Analysis of the system shows that 40% of support requests are about technical issues, 35% about account management, and 25% about billing. The triage agent processes all requests through the billing agent as a mandatory first step.

**Question:** A development team builds a customer support agent system with a triage agent, a billing agent, and an escalation agent. The triage agent always routes every request through the billing agent first before checking other specialists. What is the primary anti-pattern here?

**Options:**

A. Reliance on too many specialist agents creates unnecessary system complexity

B. Merge the billing agent functionality directly into the triage agent instead

C. **[✓]** Forcing every request through the full pipeline adds latency and token waste

D. A single monolithic agent should handle routing instead of multiple specialists

**Correct Answer:** C

**Explanation:** The anti-pattern is unconditionally routing through the full pipeline. A coordinator should use classification to direct requests only to relevant agents. Forcing every request through every specialist creates unnecessary latency, token consumption, and potential error surface area. The correct approach is intent-based routing where the coordinator classifies the request and dispatches only to relevant agents.

**Source:** Exam Guide Ã‚Â§Task 1.4

---

### q005 — Task 1.5

**Scenario:** Research agents each produce analysis documents. The synthesis agent needs to combine these findings into a unified report.

**Question:** A multi-agent system has a research coordinator, a findings synthesis agent, and a report generator. How should the synthesis agent access findings from the research agents?

**Options:**

A. Give the synthesis agent access to the full conversation history of all research agents

B. Let the synthesis agent call back to research agents on demand when it needs data

C. **[✓]** Have the coordinator explicitly pass relevant findings to the synthesis agent in the task description

D. Store all findings in a shared database that all agents can read at any time

**Correct Answer:** C

**Explanation:** Context isolation between subagents is critical. The coordinator should explicitly pass relevant findings to the synthesis agent via the task description or tool call parameters. This maintains clean separation of concerns, prevents context pollution, and ensures each agent receives only the information it needs. Direct access to other agents' histories or shared mutable state creates coupling and can lead to context degradation.

**Source:** Exam Guide Ã‚Â§Task 1.5

---

### q006 — Task 1.6

**Scenario:** The coordinator correctly identifies when subagent help is needed and issues task requests, but the subagents never execute and the coordinator receives no results.

**Question:** A coordinator agent is designed to spawn subagents for specialized analysis tasks. The coordinator is not producing the expected results when it tries to delegate. What is the most likely configuration issue?

**Options:**

A. The subagents lack sufficient system prompt instructions for their tasks

B. The API key does not have permissions for multi-agent workflow types

C. **[✓]** The Task tool is not listed in the coordinator allowed tools configuration

D. The subagents must be registered in a separate configuration file

**Correct Answer:** C

**Explanation:** For a coordinator to spawn subagents using the Task tool, that tool must be explicitly listed in the coordinator's allowedTools configuration. Without this, the coordinator's request to delegate is silently ignored or rejected. This is a common misconfiguration. The solution is to ensure the coordinator's tool configuration includes the Task tool.

**Source:** Exam Guide Ã‚Â§Task 1.6

---

### q007 — Task 1.7

**Scenario:** The agent must handle PCI-sensitive operations. Before any financial transaction is executed, the system must verify compliance requirements are met.

**Question:** A financial services company uses a customer support agent with a process_refund tool that can issue payments. Management requires verified customer identification before any refund can be executed. Logs show the agent occasionally skips the get_customer tool and calls process_refund using only a stated name, causing incorrect refunds to be issued. Which approach provides the most reliable enforcement of this business rule?

**Options:**

A. **[✓]** Implement a programmatic prerequisite gate that blocks process_refund until get_customer has returned a verified customer identifier

B. Add a system prompt instruction stating that customer verification must occur before any refund operation is executed

C. Include few-shot examples showing the agent always calling get_customer before process_refund in every case

D. Configure a routing classifier that analyzes each request type and enables only the tools appropriate for that request category

**Correct Answer:** A

**Explanation:** A programmatic prerequisite gate (via a PreToolUse hook or validation layer) that checks compliance conditions before allowing financial operations is essential for PCI compliance. Relying solely on model instructions is insufficient for regulatory requirements. The gate should verify conditions like identity verification, amount limits, and audit logging requirements before allowing any financial tool execution.

**Source:** Exam Guide Ã‚Â§Task 1.7

---

### q008 — Task 1.8

**Scenario:** After multiple interactions, the billing agent determines the case requires senior team involvement due to a policy exception.

**Question:** A customer support agent needs to hand off a complex case from the billing specialist to the senior escalation team. What information must the handoff summary include?

**Options:**

A. Only the case identifier and the main reason for escalation

B. The complete raw conversation history for the senior team to read

C. **[✓]** Customer details, root cause, actions taken, and commitments made

D. Just the customer name and the disputed financial amount

**Correct Answer:** C

**Explanation:** A proper handoff summary must include: customer details (identity, account info), root cause (what led to the issue), actions taken (what has already been attempted or resolved), and commitments made (any promises or expectations set with the customer). This ensures the receiving team has full context without needing to re-read raw conversation logs, enabling efficient case continuation.

**Source:** Exam Guide Ã‚Â§Task 1.8

---

### q009 — Task 1.9

**Scenario:** Different subagents return timestamps in different formats: one uses ISO 8601, another uses Unix epoch, and a third uses human-readable dates.

**Question:** A multi-agent scheduling system uses various date/time formats from subagents. How should you ensure consistent timestamp formatting across all agents?

**Options:**

A. Document the required format in the project README and have developers comply manually

B. **[✓]** Use a PostToolUse hook to normalize all timestamps to a standard format after execution

C. Have the coordinator agent reformat timestamps in natural language after receiving results

D. Accept all formats and convert everything at the presentation layer only for display

**Correct Answer:** B

**Explanation:** A PostToolUse hook is the correct mechanism for transforming tool results after execution. By normalizing timestamps in this hook, you ensure consistent formatting before results reach the model or downstream agents. This keeps formatting logic centralized and maintainable, rather than relying on individual agents to comply or performing ad-hoc conversions.

**Source:** Exam Guide Ã‚Â§Task 1.9

---

### q010 — Task 1.10

**Scenario:** The agent currently calls a process_refund tool directly when the model decides to issue a refund. You need to add the approval gate without modifying the tool itself.

**Question:** A refund processing agent uses a process_refund tool that can issue customer payments. Management mandates that any refund exceeding five hundred dollars must receive manager approval before execution. The current implementation relies on a system prompt instruction asking the agent to seek approval, but logs show refunds over the threshold are occasionally processed without authorization. Which mechanism should replace this prompt-based approach?

**Options:**

A. **[✓]** Implement a PreToolUse hook that intercepts calls and blocks refunds over five hundred dollars while redirecting to an escalation workflow

B. Add a post-processing audit step that reviews all refunds after execution and flags unauthorized transactions for manual follow-up

C. Create a separate manager_approval tool that the agent must call before process_refund for any amount exceeding the threshold

D. Reduce the refund limit parameter in the process_refund tool and require a separate tool for amounts that exceed that limit

**Correct Answer:** A

**Explanation:** A PreToolUse hook is the correct interception mechanism. It runs before the tool executes, can inspect the tool parameters (like refund amount), and can block the call, redirect to an approval flow, or log the attempt. This provides a programmatic guard that cannot be bypassed by the model, unlike prompt instructions which the model might ignore or misinterpret.

**Source:** Exam Guide Ã‚Â§Task 1.10

---

### q011 — Task 1.11

**Scenario:** A user submits a high-level investigation request without specifying particular metrics, time ranges, or systems to examine.

**Question:** When an agent receives a vague or open-ended request like 'investigate the performance issues,' how should the agent structure its approach?

**Options:**

A. Ask the user for clarification before proceeding with any investigation action

B. Run a broad analysis of all available performance metrics simultaneously

C. **[✓]** Use dynamic decomposition to break the investigation into concrete sub-tasks

D. Request a structured investigation plan from the user including specific metrics and systems to examine

**Correct Answer:** C

**Explanation:** Dynamic decomposition is the correct pattern for open-ended investigation tasks. The agent should autonomously break down the vague request into concrete, actionable sub-tasks (e.g., 'check CPU usage', 'analyze query latency', 'review error rates'). This demonstrates proactive architectural judgment rather than requiring human clarification at every step. The decomposition should be explicit in the agent's reasoning so the user can see and validate the plan.

**Source:** Exam Guide Ã‚Â§Task 1.11

---

### q012 — Task 1.12

**Scenario:** The review spans 200+ files across multiple packages. The agent must assess code quality, security issues, and adherence to project conventions.

**Question:** An architect is designing a large-scale code review agent that must analyze hundreds of files. What is the optimal architectural pattern for file analysis in this context?

**Options:**

A. Feed all files into a single large context window at once

B. Analyze files in random order and gather findings as they appear

C. **[✓]** Use per-file local analysis then aggregate findings in a cross-file pass

D. Only review files that have the most recent git changes applied

**Correct Answer:** C

**Explanation:** The correct pattern is per-file local analysis (examining each file individually for issues) followed by cross-file integration (identifying patterns, inconsistencies, and architectural concerns across files). This two-pass approach avoids context window overflow while still capturing system-level issues. Single-pass approaches lose cross-file context, and random sampling risks missing critical issues.

**Source:** Exam Guide Ã‚Â§Task 1.12

---

### q013 — Task 1.13

**Scenario:** The developer was in the middle of a complex refactoring session and realized a configuration file needs updating. After saving the file externally, they want to continue the session.

**Question:** A developer makes changes to a configuration file while a Claude Code session is running. How should the developer resume work with the updated configuration?

**Options:**

A. Start a brand new session entirely and re-enter all of the context manually

B. Append all the changes to the conversation history as a new user message

C. The running session automatically detects file changes and reloads the configuration

D. **[✓]** Use the resume flag to inform the agent the file was changed

**Correct Answer:** D

**Explanation:** Using --resume restores the previous session context, but the developer should explicitly inform the agent that the configuration file has changed. The agent can then re-read the file and adapt its understanding. Automatic detection of external file changes is not guaranteed, and starting a new session loses all progress. Explicit communication about changes is essential.

**Source:** Exam Guide Ã‚Â§Task 1.13

---

### q014 — Task 1.14

**Scenario:** The team has a working codebase but wants to evaluate two different architectural approaches: one using a microservices pattern and another using modular monolith.

**Question:** An architect has a stable baseline implementation and wants to explore two alternative refactoring approaches without losing the original work. What is the recommended approach?

**Options:**

A. Modify the original codebase directly and use git branches to track all changes

B. **[✓]** Use fork_session to create independent exploration branches from the same baseline

C. Build both alternatives in separate directories from scratch manually for comparison

D. Ask the agent to describe both approaches without writing any actual code

**Correct Answer:** B

**Explanation:** fork_session is designed for exploring divergent approaches from the same baseline. It creates independent session branches that share the initial context but can diverge in different directions. This is ideal for architectural exploration where you want to compare multiple approaches without affecting the original session or losing the baseline context. Git branches alone do not capture the conversational context.

**Source:** Exam Guide Ã‚Â§Task 1.14

---

### q015 — Task 1.15

**Scenario:** The request touches frontend, backend, and infrastructure concerns simultaneously.

**Question:** A user submits a single request that contains multiple distinct concerns: 'Update the login page styling, add rate limiting to the API, and fix the database connection pool leaks.' How should the agent handle this?

**Options:**

A. Handle all three concerns sequentially in a single session for context coherence

B. **[✓]** Decompose the request into parallel investigations focused on each concern then synthesize

C. Respond to just the first concern and ask for separate requests for the others

D. Combine all three changes into a single unified approach to reduce complexity

**Correct Answer:** B

**Explanation:** Multi-concern requests should be decomposed into parallel investigations. Each concern (styling, rate limiting, connection pooling) can be investigated independently by separate subagents or focused analysis passes. After parallel investigation, the coordinator synthesizes findings into a unified implementation plan. This is far more efficient than sequential processing and reduces total time.

**Source:** Exam Guide Ã‚Â§Task 1.15

---

### q016 — Task 1.16

**Scenario:** The initial discovery identified 15 potential vulnerabilities. The agent now needs to deeply investigate the critical ones. The user needs visibility into what was found before approving the deep dive.

**Question:** A security audit agent has completed its initial discovery phase and needs to transition into a deep-dive investigation. What architectural pattern supports this transition effectively?

**Options:**

A. Proceed directly into the deep-dive investigation on all potential issues that are found

B. **[✓]** Present a structured summary of findings and a proposed deep-dive plan before proceeding

C. Go back to the user for individual approval on each of the discovered items

D. Randomly select a few items for the deep-dive to stay within time constraints

**Correct Answer:** B

**Explanation:** Phase transition summarization is the correct pattern. Between major phases (discovery to deep-dive), the agent should produce a structured summary of findings and a clear plan for the next phase. This provides a checkpoint for the user to review, approve, or redirect before significant additional work begins. It balances autonomy with appropriate human oversight.

**Source:** Exam Guide Ã‚Â§Task 1.16

---

### q061 — Task 1.17

**Scenario:** The system has 5 specialist agents handling different domains. The coordinator receives all user requests and delegates accordingly.

**Question:** A team is designing a multi-agent system where a coordinator delegates tasks to subagents. What is the primary benefit of using a hub-and-spoke architecture where all communication flows through a central coordinator?

**Options:**

A. It permits agents to communicate directly with each other for faster information sharing

B. **[✓]** It provides a single control point for routing and context and prevents unconstrained agent communication

C. It reduces the total number of API calls that are needed to complete any task

D. It eliminates the need for separate tool definitions since the coordinator handles everything

**Correct Answer:** B

**Explanation:** A hub-and-spoke architecture with a central coordinator provides controlled routing, centralized context management, and organized result synthesis. The key benefit is preventing unconstrained agent-to-agent communication, which can lead to context pollution, runaway conversations, and unpredictable behavior. The coordinator acts as a controlled gateway and synthesis point.

**Source:** Exam Guide Ã‚Â§Task 1.17

---

### q062 — Task 1.18

**Scenario:** Every tool call across all agents in the system must be logged with its parameters before execution. Failed validations should block the call.

**Question:** A developer wants to intercept every tool call before execution to log parameters for audit purposes and validate inputs against security rules. What mechanism should be used?

**Options:**

A. Embed custom logging statements inside each individual tool for audit tracking purposes

B. **[✓]** Implement a PreToolUse hook that runs before every tool execution to log and validate

C. Ask the model to log its own tool calls through a special purpose tool

D. Use a proxy server between the API and agent to intercept all requests

**Correct Answer:** B

**Explanation:** A PreToolUse hook is the centralized mechanism for intercepting tool calls before execution. It runs automatically on every tool invocation, can log parameters, perform validation, and block or modify the call if needed. This provides a consistent audit trail without modifying individual tools and cannot be bypassed by the model.

**Source:** Exam Guide Ã‚Â§Task 1.18

---

### q063 — Task 1.19

**Scenario:** A user submits a request to 'design a complete authentication system including login, registration, password reset, and OAuth integration'.

**Question:** An architect is designing a system where a coordinator decomposes a complex user request into smaller tasks and delegates them to subagents. What is the correct sequence of operations for task decomposition?

**Options:**

A. Execute all subtasks simultaneously without coordination and combine results at the end

B. Ask the subagents to handle the decomposition themselves without coordinator input

C. **[✓]** Analyze the request decompose into subtasks assign to subagents and synthesize results

D. Have the coordinator do all the work itself without using any subagents

**Correct Answer:** C

**Explanation:** Task decomposition follows a structured sequence: (1) analyze the complex request to understand its components, (2) decompose into well-defined, independent subtasks with clear specifications and acceptance criteria, (3) assign each subtask to the appropriate subagent via the Task tool, and (4) synthesize individual results into a coherent final output. This pattern maximizes parallelism while maintaining quality control.

**Source:** Exam Guide Ã‚Â§Task 1.19

---

### q064 — Task 1.20

**Scenario:** An investigation involves collecting logs, analyzing patterns, cross-referencing with deployment history, and producing a report. The work spans multiple CLI sessions.

**Question:** A development team is building an agent that participates in long-running investigations spanning multiple hours. They need to save progress and restore it across CLI sessions. What session management approach is correct?

**Options:**

A. Rely on the model to remember all context across different CLI sessions

B. **[✓]** Use named sessions that can be saved and resumed across CLI restarts

C. Take screenshots of the CLI output and re-enter context manually each time

D. Write a shell script that re-runs the entire investigation from scratch

**Correct Answer:** B

**Explanation:** Named sessions provide the ability to save conversation state and resume across CLI sessions. This is essential for long-running investigations where the work naturally spans multiple sessions. Named sessions persist the entire conversation context, including tool results and the model's reasoning state, enabling interruption-free resumption.

**Source:** Exam Guide Ã‚Â§Task 1.20

---

### q065 — Task 1.21

**Scenario:** The security scanner subagent crashes due to a malformed input file. The coordinator needs to continue processing other subagents and handle the failed one appropriately.

**Question:** A multi-agent system must gracefully handle errors in subagents. A security scanning subagent encounters an unhandled exception. What is the appropriate error handling pattern?

**Options:**

A. Crash the system when a subagent fails to ensure no issues slip through

B. **[✓]** Catch subagent failures gracefully log the error and continue processing other tasks

C. Ignore subagent failures entirely and use whatever partial results are available

D. Restart failed subagents in an infinite loop repeatedly until they succeed

**Correct Answer:** B

**Explanation:** The correct error handling pattern is to catch subagent failures gracefully: log the error with full context, allow other independent subagents to continue processing, and report the failure to the user with sufficient context for resolution. This avoids both the extreme of crashing the entire system and the opposite extreme of silently ignoring failures.

**Source:** Exam Guide Ã‚Â§Task 1.21

---

### q066 — Task 1.22

**Scenario:** An agent sometimes enters a loop of unnecessary tool calls, consuming tokens without making progress. The team wants to limit this behavior.

**Question:** A team is configuring the agent SDK for a multi-agent system. They need to set the maximum number of consecutive tool calls an agent can make before being forced to respond. What configuration controls this?

**Options:**

A. Set a low token limit to force the agent to respond much sooner

B. **[✓]** Configure max_tool_rounds in the agent SDK configuration to cap consecutive tool calls

C. Remove tools from the agent so it has many fewer options to call

D. Add a system prompt instruction that says limit your tool calls please

**Correct Answer:** B

**Explanation:** The agent SDK configuration includes settings like max_tool_rounds or max_consecutive_tool_calls that set a hard limit on how many sequential tool calls an agent can make without producing a text response. This is a safety guard against runaway tool usage and token waste. It is enforced programmatically, unlike prompt instructions which are advisory.

**Source:** Exam Guide Ã‚Â§Task 1.22

---

### q067 — Task 1.23

**Scenario:** The application is a customer support agent handling a complex multi-issue case. The conversation spans many turns with various tool calls and results.

**Question:** An AI-powered application has a conversation history that has grown to 150 messages. The context window is approaching its limit and the model's responses are becoming less coherent. How should conversation history be managed?

**Options:**

A. Delete the oldest messages in the conversation when approaching the context limit

B. **[✓]** Summarize older turns prune irrelevant tool results and maintain structured facts for critical data

C. Increase the model context window size to accommodate the full conversation history

D. End the conversation and start a completely new session when the window gets full

**Correct Answer:** B

**Explanation:** Conversation history management requires a thoughtful strategy: (1) summarize older turns that are no longer immediately relevant, (2) prune verbose tool results that have served their purpose, (3) maintain a structured facts block for critical information that must persist, and (4) use sliding window approaches where appropriate. Simple deletion of oldest messages risks losing important context.

**Source:** Exam Guide Ã‚Â§Task 1.23

---

### q068 — Task 1.24

**Scenario:** The triage agent identifies that the customer's problem has both a technical component (service outage) and a billing component (incorrect charges during the outage).

**Question:** A multi-agent system needs to transfer context from a triage agent to a billing specialist when a customer's issue involves both technical and billing concerns. What is the correct handoff pattern?

**Options:**

A. Start a completely new session from scratch when switching between different agents

B. Have both agents work independently and present separate results to the customer

C. **[✓]** Use a structured agent handoff where the triage agent passes a summary to billing

D. Have the customer repeat all of the information to the billing specialist

**Correct Answer:** C

**Explanation:** The correct pattern is a structured agent handoff where the triage agent passes a comprehensive summary to the billing specialist. This summary should include: findings from the technical investigation, customer details, actions already taken, commitments made, and the specific billing issue that needs resolution. This ensures continuity without requiring the customer to repeat information or losing context.

**Source:** Exam Guide Ã‚Â§Task 1.24

---

### q069 — Task 1.25

**Scenario:** The agent was processing a refund: it validated the customer, checked the transaction history, and was about to process the refund when the system restarted.

**Question:** An agent's session is interrupted by a system restart. The agent was in the middle of a multi-step transaction. How should state persistence be handled to enable safe resumption?

**Options:**

A. Lose the state and ask the customer to start over from the very beginning

B. **[✓]** Persist the transaction state to external storage and provide it to the resumed session

C. Restart the session and let the model re-collect all information naturally again

D. Store only the final result of each step without any intermediate state

**Correct Answer:** B

**Explanation:** State persistence involves saving the current transaction state to external storage so it can be restored after interruption. This includes: which steps have been completed, what data was collected, and what the next action should be. Upon resumption, this state is loaded and provided to the model. For multi-step transactions, especially those involving financial operations, losing state is unacceptable.

**Source:** Exam Guide Ã‚Â§Task 1.25

---

### q070 — Task 1.26

**Scenario:** The system consists of a coordinator and 10 specialist agents running in production. The team needs to understand why certain decisions were made and diagnose failures.

**Question:** An architect needs to add observability to a multi-agent system to monitor agent decisions, tool usage patterns, and error rates. What is the most appropriate approach?

**Options:**

A. Add console log statements in every tool implementation across all agents

B. Monitor only the API response times and error codes for the system

C. Ask every agent to write a summary report after each interaction turn

D. **[✓]** Implement structured logging at the agent SDK level capturing decisions and errors

**Correct Answer:** D

**Explanation:** Agent observability should be implemented at the agent SDK or framework level, providing centralized structured logging of: agent decisions (what the model chose and why), tool usage patterns (which tools, how often, success/failure), error rates, and timing information. This is far more maintainable than adding logging to individual tools and provides consistent, searchable output for debugging and analysis.

**Source:** Exam Guide Ã‚Â§Task 1.26

---

### q071 — Task 1.27

**Scenario:** The workflow involves: (A) analyze API spec, (B) generate client library, (C) write integration tests. Step B depends on A's output, and step C depends on B's output.

**Question:** An architect is evaluating whether to run subagents in parallel or sequentially for a given workflow. What factor most strongly suggests that sequential execution is required?

**Options:**

A. The total number of subagents in the workflow is more than three

B. **[✓]** Sequential execution is required when subagent tasks have dependency chains between them

C. Parallel execution is always superior regardless of the task dependencies

D. The model performs significantly better when tasks are done sequentially

**Correct Answer:** B

**Explanation:** The determining factor is task dependencies. When subagents have dependent chains (B needs A's output, C needs B's output), sequential execution is required. Parallel execution is only appropriate for truly independent tasks. Forcing parallel execution on dependent tasks leads to coordination problems and rework. The architect must analyze the dependency graph before deciding.

**Source:** Exam Guide Ã‚Â§Task 1.27

---

### q072 — Task 1.28

**Scenario:** Simple queries like 'what's my account balance' need no subagents, while complex ones like 'analyze our cloud costs and recommend optimizations' need multiple specialists.

**Question:** A multi-agent system receives queries of varying complexity: simple lookups, moderate analysis, and complex multi-domain investigations. How should the system allocate subagents?

**Options:**

A. Always allocate the same set of subagents regardless of the query complexity

B. **[✓]** Use dynamic subagent selection where the coordinator determines query complexity and allocates appropriately

C. Never use subagents for any query type no matter the complexity involved

D. Always allocate all available subagents to ensure the maximum thoroughness possible

**Correct Answer:** B

**Explanation:** Dynamic subagent selection based on query complexity is the correct pattern. Simple queries should be handled directly by the coordinator without spawning subagents (avoiding overhead). Complex queries should trigger appropriate subagent allocation. This balances efficiency with thoroughness and avoids the waste of over-engineering simple requests or under-resourcing complex ones.

**Source:** Exam Guide Ã‚Â§Task 1.28

---

### q073 — Task 1.29

**Scenario:** The agent is investigating a security incident and must remember: incident timeline, affected systems, findings from each investigation phase, and remediation steps taken.

**Question:** A long-running agent needs to retain information across many conversation turns without losing it to context compression or summarization. How should critical information be managed?

**Options:**

A. Rely on the model ability to remember everything from the conversation history

B. Write all of the relevant information to a database and query it when needed

C. Only keep the most recent ten messages in context and archive all the rest

D. **[✓]** Use structured facts blocks in context and external scratchpad files for critical information

**Correct Answer:** D

**Explanation:** Agent memory and context retention requires a defense-in-depth approach: (1) maintain a structured facts block within the current context for active information, (2) write detailed findings to external scratchpad files periodically, and (3) use summarization to compress older turns while preserving key data. Redundancy is important because context management mechanisms may lose information.

**Source:** Exam Guide Ã‚Â§Task 1.29

---

### q074 — Task 1.30

**Scenario:** Various analysis tools return results in different formats. The agent needs to normalize all results into a consistent structure (finding type, severity, file, line, description) before further processing.

**Question:** A team of developers is building an AI-powered code analysis tool that needs to transform tool results after execution to format them consistently. What hook mechanism should they use?

**Options:**

A. Ask each developer to manually format their own tool output consistently

B. **[✓]** Implement a PostToolUse hook to transform tool results into the standard structure

C. Have the model reformat the outputs in its natural language response

D. Store raw tool outputs and format them at the presentation layer only

**Correct Answer:** B

**Explanation:** A PostToolUse hook is the correct mechanism for transforming tool results after execution but before they reach the model. It normalizes results into a consistent structure regardless of the source tool. This ensures the model always receives data in the expected format and keeps transformation logic centralized rather than distributed across tool implementations.

**Source:** Exam Guide Ã‚Â§Task 1.30

---

### q075 — Task 1.31

**Scenario:** An automated code review agent should make no more than 50 tool calls per session to control API costs. If the limit is exceeded, the session should terminate.

**Question:** An agent needs to limit the total number of tool calls made in a single session to prevent runaway costs. What configuration mechanism enforces this limit?

**Options:**

A. Ask the model to limit its tool calls in the system prompt only

B. **[✓]** Configure a maximum tool call limit in the agent SDK to terminate the session

C. Monitor tool calls externally and manually kill the process when it is needed

D. Reduce the number of available tools significantly to limit the options when needed

**Correct Answer:** B

**Explanation:** Agentic loop safety guards should be configured in the agent SDK settings. This includes maximum tool call limits per session, maximum consecutive tool calls, and maximum token usage. These are programmatic limits enforced by the SDK, not advisory instructions. When exceeded, the session terminates gracefully with a clear reason.

**Source:** Exam Guide Ã‚Â§Task 1.31

---

### q076 — Task 1.32

**Scenario:** A code generation tool accepts a 'language' parameter. An attacker could try to inject instructions through this parameter to override the system prompt.

**Question:** A security architect wants to add input validation to prevent prompt injection through tool parameters. What mechanism should be used?

**Options:**

A. Trust that the model will detect and reject injection attempts on its own

B. **[✓]** Use a PreToolUse hook to validate and sanitize tool call parameters before execution

C. Remove all the parameters from the tool to completely prevent injection

D. Only use tools that have built-in injection protection mechanisms for safety

**Correct Answer:** B

**Explanation:** Tool call interception via PreToolUse hooks is the appropriate mechanism for security validation. The hook runs before the tool executes and can inspect parameters for injection patterns, block suspicious calls, sanitize inputs, or log the attempt. Programmatic validation in the hook layer is more reliable than relying on the model to detect injection attempts.

**Source:** Exam Guide Ã‚Â§Task 1.32

---

### q121 — Task 1.13

**Scenario:** The system has a coordinator agent that delegates research tasks to subagents for competitor analysis, customer sentiment, and pricing trends. Each subagent produces findings the coordinator synthesizes.

**Question:** An architect is designing a multi-agent research system where a coordinator delegates to specialized subagents. Which principles should guide the tool and context design between the coordinator and subagents? (Select all that apply.)

**Options:**

A. **[✓]** Subagents should receive only the context and tools relevant to their specific investigation task

B. The coordinator should pass the full conversation history of the entire system to each subagent

C. **[✓]** Each subagent should maintain context isolation from other subagents to prevent pollution

D. All subagents should share a common tool pool to maximize flexibility and coverage

**Correct Answers:** A, C

**Explanation:** The correct principles are context isolation and least-privilege tool assignment. Each subagent should receive only the context and tools relevant to its task (option 0) to prevent distraction and reduce token costs. Subagents must maintain context isolation from each other (option 2) to avoid information leakage and context pollution. Passing full conversation history (option 1) would dilute focus and waste tokens. A shared tool pool (option 3) violates least-privilege principles.

**Source:** Exam Guide Ã‚Â§Task 1.13

---

## D2: Tool Design & MCP Integration (23 questions)

### q017 — Task 2.1

**Scenario:** The agent misidentifies which tool to use for a given task about 30% of the time, leading to wasted tool calls and incorrect results.

**Question:** A code analysis agent has three tools with descriptions that read Finds files matching a name pattern, Searches code for specific text patterns, and Reads file contents by given path. The model frequently selects the wrong tool for a given request, calling the search tool when it should read a file and vice versa. Which approach would most effectively improve the model tool selection accuracy?

**Options:**

A. **[✓]** Expand each tool description with explicit usage examples input formats and clear differentiation from similar tool alternatives

B. Combine all three tools into a single unified tool that accepts any query type and internally routes to the appropriate engine

C. Add a pre-processing classifier that analyzes each user request and programmatically selects the correct tool before execution

D. Reduce the number of available tools by removing overlapping functionality and consolidating capabilities into fewer options

**Correct Answer:** A

**Explanation:** The key is to expand tool descriptions to include detailed guidance on when and when not to use each tool. Descriptions should include concrete usage examples, clear differentiation from similar tools, and explicit exclusion criteria. Simply renaming tools does not help the model distinguish between them. Good descriptions act as documentation embedded in the tool definition.

**Source:** Exam Guide Ã‚Â§Task 2.1

---

### q018 — Task 2.2

**Scenario:** The subagents include: a style checker (needs eslint), a security scanner (needs semgrep), a dependency analyzer (needs npm audit), a test runner (needs jest), and a documentation generator (needs typedoc).

**Question:** An architect is designing a multi-agent code analysis system with five specialist subagents, each needing access to different tools. What is the correct principle for tool distribution?

**Options:**

A. Give all five available tools to every subagent to maximize flexibility

B. **[✓]** Give each subagent only the specific domain tools it needs scoped per agent

C. Create one uber-agent with all tools and have it delegate work internally

D. Put all tools on a shared MCP server accessible to all agents equally

**Correct Answer:** B

**Explanation:** Each subagent should receive only the tools scoped to its specific domain. Scoped tool access per subagent prevents confusion, reduces the chance of calling the wrong tool, and keeps each agent focused on its responsibility. Giving every tool to every agent increases the cognitive load on the model and raises the risk of inappropriate tool selection.

**Source:** Exam Guide Ã‚Â§Task 2.2

---

### q019 — Task 2.3

**Scenario:** The payment tool can fail due to network timeouts (transient), invalid input (validation), or insufficient funds (business rule). The coordinator needs to handle each differently.

**Question:** An API gateway agent integrates with a payment processor tool that can fail in various ways. How should the agent communicate errors back to the coordinator for proper recovery?

**Options:**

A. Return all errors as generic operation failed messages to keep responses simple

B. Have the tool raise exceptions that crash the agent to make the error obvious

C. Log the specific error internally but always tell the coordinator to retry

D. **[✓]** Return structured error responses with an errorCategory field indicating the failure type

**Correct Answer:** D

**Explanation:** Structured error responses with an errorCategory field enable the coordinator to apply appropriate recovery strategies: transient errors should be retried with backoff, validation errors should fix the input, and business errors should escalate to a human. Generic error messages deprive the coordinator of the context needed for intelligent recovery.

**Source:** Exam Guide Ã‚Â§Task 2.3

---

### q020 — Task 2.4

**Scenario:** The tool fails about 5% of the time with timeout errors that typically resolve within 2-3 seconds.

**Question:** A tool occasionally fails with transient network errors. The agent needs to handle these robustly. What retry strategy is most appropriate?

**Options:**

A. Retry immediately up to ten times in rapid succession without delay

B. **[✓]** Use exponential backoff with a reasonable max delay and retry limit

C. Retry immediately once, then escalate to a monitoring alert on the second consecutive failure

D. Retry exactly one time after a fixed thirty second delay period

**Correct Answer:** B

**Explanation:** Exponential backoff with a reasonable maximum delay and retry count is the standard pattern for transient errors. It starts with short delays and increases exponentially (e.g., 1s, 2s, 4s, 8s), giving the system time to recover while not overwhelming it with retries. Immediate retries in a tight loop can exacerbate the problem, and a single fixed-delay retry may not be sufficient.

**Source:** Exam Guide Ã‚Â§Task 2.4

---

### q021 — Task 2.5

**Scenario:** The synthesis agent collects findings from research agents and must verify conflicting claims. You want to give it just enough access to verify facts without granting full tool access.

**Question:** A multi-agent system has a synthesis agent that needs to verify facts across multiple source agents. The synthesis agent should not have access to all tools, but needs a specific verification capability. How should this be implemented?

**Options:**

A. Grant the synthesis agent all the same tools the research agents have for flexibility

B. Have the synthesis agent ask the coordinator to verify facts on its behalf

C. **[✓]** Create a scoped verify_fact tool only for the synthesis agent against the shared knowledge base

D. Prevent the synthesis agent from having any verification capability at any given point

**Correct Answer:** C

**Explanation:** A scoped cross-role tool (verify_fact) that is available only to the synthesis agent provides the precise capability needed without exposing unnecessary tools. This follows the principle of least privilege: each agent gets only the tools it needs. The synthesis agent needs verification ability but does not need raw search or analysis tools.

**Source:** Exam Guide Ã‚Â§Task 2.5

---

### q022 — Task 2.6

**Scenario:** The team uses a shared repository with common MCP servers for linting, testing, and deployment. Individual developers need to add personal utility tools without affecting the team configuration.

**Question:** A team wants to share MCP server configuration for their project while allowing individual developers to add personal tools. What is the correct configuration file structure?

**Options:**

A. Put all configuration in a single shared file for developers to edit locally

B. Put team configuration in CLAUDE.md and personal config in a separate .env file

C. **[✓]** Use .mcp.json at the project root for shared config and ~/.claude.json for personal additions

D. Duplicate the entire configuration in each developer personal workspace directory by itself

**Correct Answer:** C

**Explanation:** MCP server configuration follows a layering strategy: .mcp.json at the project root is shared via version control for team-wide tools, while ~/.claude.json (or ~/.claude/settings.json) contains personal additions. Settings are merged with project-level settings taking priority for shared config and user-level settings for personal additions.

**Source:** Exam Guide Ã‚Â§Task 2.6

---

### q023 — Task 2.7

**Scenario:** The team built a custom code analysis MCP tool that provides richer results than the built-in Read tool, but the model chooses the built-in tool 70% of the time.

**Question:** A developer notices that when multiple tools are available, the model frequently uses built-in tools (like Read or Grep) instead of the team's custom MCP tools that provide better analysis. How should this be addressed?

**Options:**

A. Remove the built-in Read and Grep tools from the available tools list entirely

B. Reduce the number of built-in tools by disabling them in configuration settings

C. Rename the MCP tool to start with read or grep for model preference

D. **[✓]** Enhance the MCP tool description to articulate its advantages over built-in alternatives

**Correct Answer:** D

**Explanation:** To compete effectively with built-in tools, the MCP tool description must be enhanced to clearly articulate its advantages. Explain what it does better, what additional analysis it provides, and in what scenarios it should be preferred. The model selects tools based on descriptions, so a more informative description directly influences selection behavior.

**Source:** Exam Guide Ã‚Â§Task 2.7

---

### q024 — Task 2.8

**Scenario:** The codebase has 5,000+ files across multiple directories. The developer needs to find every usage of 'deprecatedApiCall()' to plan a migration.

**Question:** A developer needs to find all occurrences of a deprecated API function across a large codebase. Which built-in tool is most appropriate for this task?

**Options:**

A. Read each individual file one by one using the Read tool itself

B. Use the Glob tool to find files matching a pattern then search manually

C. **[✓]** Use the Grep tool to search for the pattern across all codebase files

D. Use a custom MCP tool that was specifically built for this codebase

**Correct Answer:** C

**Explanation:** The Grep tool is designed for searching file contents across a codebase. It performs regex pattern matching across files, which is exactly what this scenario requires. Glob matches file paths, not contents. Read can only handle individual files and would be extremely inefficient for a codebase of this size.

**Source:** Exam Guide Ã‚Â§Task 2.8

---

### q025 — Task 2.9

**Scenario:** The project has a deeply nested directory structure with source files, test files, and configuration files mixed together.

**Question:** A developer needs to list all test files in a project that follow the naming convention '*.test.ts' or '*.spec.ts'. Which built-in tool is most appropriate?

**Options:**

A. Use the Grep tool to search each directory for matching test file names

B. List the directory recursively with Read and filter the results manually

C. **[✓]** Use the Glob tool with a pattern like '**/*.{test,spec}.ts' to match file names

D. Use a shell command to find all matching test files in the project

**Correct Answer:** C

**Explanation:** The Glob tool is designed specifically for file path pattern matching. A glob pattern like **/*.{test,spec}.ts will efficiently match all test and spec files regardless of directory depth. Grep searches file contents, not paths, making it unsuitable for this task.

**Source:** Exam Guide Ã‚Â§Task 2.9

---

### q026 — Task 2.10

**Scenario:** A file has 50 lines containing 'margin: 10px', and you need to change only one specific occurrence. The Edit tool reports it cannot find a unique match.

**Question:** The Edit tool fails to find a unique match for a replacement in a file with many similar lines. What is the correct fallback approach?

**Options:**

A. Re-run the Edit tool with the exact same input hoping for a different result

B. Change all fifty occurrences at once and revert the incorrect changes manually

C. **[✓]** Read the specific region then Write the entire file with the single change applied

D. Switch to a different code editor entirely to make the targeted change

**Correct Answer:** C

**Explanation:** When Edit cannot find a unique match, the correct fallback is to use Read to read the portion of the file containing the target line, then use Write to rewrite the file with the change incorporated (or use Edit with expanded surrounding context to disambiguate). Write with the full file content ensures the change is made precisely where needed.

**Source:** Exam Guide Ã‚Â§Task 2.10

---

### q027 — Task 2.11

**Scenario:** A 'query_database' tool returns complete row data including audit fields, metadata, and timestamps. The coordinator agent only needs customer_name, amount, and status.

**Question:** A database query tool returns results with 50 columns per row, but the agent only needs 3 columns for its analysis. The excessive data is consuming context window space. How should this be addressed?

**Options:**

A. Ask the developer to modify the database schema to have fewer total columns

B. Tell the model to simply ignore the extra columns present during its analysis

C. **[✓]** Use a PostToolUse hook to filter tool results to only the columns needed

D. Use a different tool that queries a denormalized view of the same data

**Correct Answer:** C

**Explanation:** A PostToolUse hook can intercept tool results and filter excessive fields before the result is added to the conversation. This preserves context window space by eliminating irrelevant data. The hook runs after the tool executes but before the result is presented to the model, making it transparent and efficient.

**Source:** Exam Guide Ã‚Â§Task 2.11

---

### q077 — Task 2.12

**Scenario:** The MCP server needs to be accessible from multiple client processes running on different machines within the same network.

**Question:** A team is building an MCP server for a code analysis tool. They need to choose between stdio and SSE transport. What factor most strongly favors SSE over stdio?

**Options:**

A. stdio transport is always the simpler option and should be preferred in all cases

B. **[✓]** SSE transport is preferred when the server needs to be accessible over a network

C. SSE is only for web browsers and cannot be used for MCP at all

D. stdio transport only works for local processes and cannot support remote connections

**Correct Answer:** B

**Explanation:** SSE (Server-Sent Events) transport is the appropriate choice when the MCP server needs to be accessible over a network, serving multiple clients remotely. stdio transport is limited to local processes where the client spawns the server as a subprocess. SSE enables client-server communication over HTTP, which is necessary for remote and multi-client scenarios.

**Source:** Exam Guide Ã‚Â§Task 2.12

---

### q078 — Task 2.13

**Scenario:** The system needs tools for: code analysis, dependency management, deployment, monitoring, and testing. Some tools are closely related and often used together.

**Question:** An architect is designing a tool ecosystem with multiple MCP servers, each providing related tools. What is the correct principle for distributing tools across servers?

**Options:**

A. Put every tool in a single MCP server for maximum simplicity

B. **[✓]** Distribute tools across MCP servers by domain grouping related tools together

C. Create one MCP server for each tool for maximum granularity

D. Randomly distribute tools across all servers to balance the load

**Correct Answer:** B

**Explanation:** Tools should be distributed across MCP servers by domain, grouping related tools together. This follows the principle of cohesion: tools that are often used together should be in the same server for efficient discovery and configuration. Overly granular servers (one per tool) create configuration overhead, while monolithic servers mix unrelated concerns.

**Source:** Exam Guide Ã‚Â§Task 2.13

---

### q079 — Task 2.14

**Scenario:** Developers and the model are confused about which tool to use because the names are semantically overlapping.

**Question:** A team is naming tools in their MCP server. They have tools like 'get_user_data', 'fetch_user_data', and 'retrieve_user_profile' that all do similar things. What naming convention problem does this illustrate?

**Options:**

A. The names are perfectly fine since they describe different retrieval methods

B. **[✓]** Tool names should follow consistent conventions with clear differentiation between them

C. All tools should have the same name with completely different parameters

D. Tool names should be kept short and cryptic to save on tokens used

**Correct Answer:** B

**Explanation:** Tool names should follow consistent naming conventions that make their purpose and differentiation clear. Using prefixes or namespaces (e.g., user:get_profile vs user:get_orders) and avoiding synonyms (get, fetch, retrieve) reduces confusion. Consistent naming improves discoverability for both human developers and the model, which selects tools based on names and descriptions.

**Source:** Exam Guide Ã‚Â§Task 2.14

---

### q080 — Task 2.15

**Scenario:** The MCP server provides tools to query employee data, financial records, and customer information. It will be used by multiple agents in the organization.

**Question:** A team is deploying an MCP server that accesses sensitive internal APIs. What security considerations are most important?

**Options:**

A. No security is needed since MCP servers are only accessible locally

B. **[✓]** Implement authentication validate authorized agents and follow least-privilege access

C. Rely on network security alone to protect the MCP server

D. Encrypt all data in transit but do not add authentication

**Correct Answer:** B

**Explanation:** MCP authentication and security requires: (1) authentication to verify the identity of the calling client, (2) authorization to ensure the caller has permission for the specific tool, (3) least-privilege access where each agent only gets the tools it needs, and (4) audit logging of all tool invocations. MCP servers that access sensitive data must not assume network-level security is sufficient.

**Source:** Exam Guide Ã‚Â§Task 2.15

---

### q081 — Task 2.16

**Scenario:** The task requires editing a specific function parameter in a file. The Edit tool sometimes cannot find unique matches in files with many similar lines.

**Question:** A developer is building a tool system and needs to decide between using built-in tools (Read, Write, Edit, Grep, Glob) and custom MCP tools for a code modification task. What is a known limitation of built-in tools?

**Options:**

A. Built-in tools have no limitations and should always be the preferred choice

B. Custom MCP tools are always slower than comparable built-in tools usually

C. Built-in tools cannot be practically used in multi-agent systems at all

D. **[✓]** Built-in tools like Edit can struggle with ambiguous matches and lack domain-specific logic

**Correct Answer:** D

**Explanation:** Built-in tools like Edit are general-purpose and can struggle with ambiguous matches (e.g., many similar lines, complex replacements). They lack domain-specific logic. Custom MCP tools can provide more targeted functionality with application-specific validation and error handling. The architect should use built-in tools for general operations and custom tools for domain-specific needs.

**Source:** Exam Guide Ã‚Â§Task 2.16

---

### q082 — Task 2.17

**Scenario:** The tool returns complete customer transaction histories. The agent only needs summary statistics (total count, total value, average per transaction) for its analysis.

**Question:** A database query tool returns very large result sets (500KB+) that consume excessive context window space. The results are needed for analysis but must be managed carefully. What strategy is most effective?

**Options:**

A. Accept the large results and let the model handle the context pressure itself

B. **[✓]** Implement result pagination at the tool level and use a PostToolUse hook to summarize

C. Reduce the total number of queries to limit the total data volume

D. Switch to a completely different tool that returns less data during usage naturally

**Correct Answer:** B

**Explanation:** Tool result size management requires a multi-layered approach: (1) implement pagination at the tool level so the model can request data in manageable chunks, (2) use a PostToolUse hook to summarize or transform verbose results into concise statistics, and (3) design tools that return only the data the model needs, not raw unprocessed datasets.

**Source:** Exam Guide Ã‚Â§Task 2.17

---

### q083 — Task 2.18

**Scenario:** The team has 25 tools with descriptions averaging 5 words each. The model selects inappropriate tools about 20% of the time.

**Question:** An architect is reviewing a team's tool definitions. Many tools have descriptions like 'Finds files' or 'Searches code.' The model frequently mis-selects tools. What is the most likely cause?

**Options:**

A. There are too many tools and the model cannot handle all of them

B. The model needs additional fine-tuning to understand these particular tools better

C. Tool names are the real problem not the brief descriptions given

D. **[✓]** Tool descriptions are too brief lacking detail usage scenarios and differentiation

**Correct Answer:** D

**Explanation:** Tool description writing best practices require: detailed descriptions including usage scenarios (when to use this tool), input/output descriptions (what parameters are needed and what the result looks like), and differentiation hints (how this tool differs from similar ones). Brief descriptions like 'Finds files' do not give the model enough information to make accurate selections.

**Source:** Exam Guide Ã‚Â§Task 2.18

---

### q084 — Task 2.19

**Scenario:** The MCP server's database connection fails intermittently. The calling agent needs to know whether to retry or report a failure.

**Question:** An MCP server encounters an error while processing a tool request. How should errors be communicated back to the calling agent?

**Options:**

A. Crash the MCP server process so the error is clearly obvious

B. **[✓]** Return a structured error response with error code category and description

C. Log the error internally and return a generic ok response to the client

D. Return the raw database error message verbatim to the calling agent

**Correct Answer:** B

**Explanation:** Error propagation from MCP servers should use the MCP protocol's structured error response format. The response should include an error code, a category (transient, validation, or internal), and a human-readable description. This allows the calling agent to determine the appropriate recovery action. Crashing the server or hiding errors are both inappropriate.

**Source:** Exam Guide Ã‚Â§Task 2.19

---

### q085 — Task 2.20

**Scenario:** The MCP server is used by multiple development teams. Updates should not cause downtime or incompatibility with existing client configurations.

**Question:** A team deploys an MCP server that provides code analysis tools. They need to update the server with new tools and improved logic. What is the correct lifecycle approach?

**Options:**

A. Stop the server and update and restart and hope clients reconnect

B. Deploy a completely new MCP server on a different port for each update

C. **[✓]** Implement versioned MCP server lifecycle with fully backward compatible endpoint design

D. Do not update the server once deployed to avoid breaking client configurations

**Correct Answer:** C

**Explanation:** MCP server lifecycle management requires: (1) versioned endpoints to avoid breaking existing clients, (2) backward compatibility for tool interfaces, (3) graceful shutdown that lets in-flight requests complete, (4) startup health checks, and (5) possibly a discovery mechanism so clients can learn about server availability. Production MCP servers cannot be treated as ad-hoc processes.

**Source:** Exam Guide Ã‚Â§Task 2.20

---

### q086 — Task 2.21

**Scenario:** The 'analyze_code' tool currently takes a 'path' parameter. The team wants to add a 'recursive' option. Existing agents call the tool without this parameter.

**Question:** A team needs to update a tool's behavior while maintaining compatibility with existing agents that already use it. What strategy should they follow?

**Options:**

A. Change the parameter to be required thus breaking all existing callers

B. Create an entirely new tool version for the new behavior needs

C. **[✓]** Add the new parameter as optional with a default to maintain backward compatibility

D. Remove the old tool and deploy the new version asking teams to update

**Correct Answer:** C

**Explanation:** Tool versioning should follow the principle of forward and backward compatibility. New parameters should be added as optional with sensible defaults so existing callers continue to work unchanged. The tool description should be updated to document the new capability. Creating entirely new tools for every change leads to proliferation and confusion.

**Source:** Exam Guide Ã‚Â§Task 2.21

---

### q087 — Task 2.22

**Scenario:** The client needs to discover available tools, call one with parameters, and receive results or errors.

**Question:** An architect is designing an MCP server and needs to understand how the server communicates tool availability and results to the client. What is the correct protocol message flow?

**Options:**

A. The client guesses tool names based on documentation and calls them directly

B. **[✓]** The MCP protocol uses capability negotiation where servers advertise tools for clients to call

C. The client reads the server source code to discover what tools are available

D. The server sends all tool results periodically without being asked by the client

**Correct Answer:** B

**Explanation:** The MCP protocol message format follows a request-response pattern: (1) initialization and capabilities negotiation, where the server advertises its tools, (2) tool call requests from the client with parameters, and (3) tool result responses from the server with structured data or error messages. This follows JSON-RPC conventions with specific MCP-defined message types for tool discovery and invocation.

**Source:** Exam Guide Ã‚Â§Task 2.22

---

### q122 — Task 2.10

**Scenario:** The MCP server must be accessible from multiple developer machines across different network segments. Some tools require access to sensitive internal APIs and proprietary codebases.

**Question:** A team is deploying an MCP server that provides code analysis tools across a distributed development environment. Which architectural decisions are appropriate for this remote deployment? (Select all that apply.)

**Options:**

A. **[✓]** Use SSE transport to enable network-accessible client-server communication

B. Use stdio transport since MCP servers must always run as local subprocesses

C. **[✓]** Implement authentication and authorization for all MCP tool invocations

D. Disable all security since MCP servers only communicate over localhost connections

**Correct Answers:** A, C

**Explanation:** For remote MCP deployments, SSE (Server-Sent Events) transport is appropriate (option 0) because it enables client-server communication over HTTP across network segments. Authentication and authorization are essential (option 2) when MCP servers access sensitive resources, including identity verification, least-privilege tool scoping, and audit logging. stdio transport (option 1) only works for local subprocesses. Disabling security (option 3) is never acceptable for production systems.

**Source:** Exam Guide Ã‚Â§Task 2.10

---

## D3: Claude Code Configuration & Workflows (24 questions)

### q028 — Task 3.1

**Scenario:** The developer prefers 2-space indentation and specific import ordering, while the team standard is 4-space indentation with different import conventions.

**Question:** A project lead creates a CLAUDE.md file with detailed coding standards and testing conventions for the team repository. Senior developers who configured their environments weeks earlier have no issues following the standards. A new team member who just cloned the repository finds that Claude Code does not apply any of the documented conventions. Investigation reveals the instructions were placed in a user-level file and never migrated to project-level version-controlled configuration. Why does the new developer lack the conventions?

**Options:**

A. **[✓]** The instructions exist only in user-level configuration not shared via version control and no project-level file was ever committed

B. The instructions use the import syntax for referencing external files which fails silently during initialization on the new machine

C. The new team member has a conflicting user-level configuration file that takes precedence over the project-level hierarchy

D. The instructions were placed in a subdirectory CLAUDE.md file that limits their application only to files within that directory

**Correct Answer:** A

**Explanation:** The user-level CLAUDE.md (typically at ~/.claude/CLAUDE.md) is not version-controlled and is intended for personal preferences. Team conventions belong in the project-level CLAUDE.md which is checked into version control. This layering allows individual customization without affecting the team standard.

**Source:** Exam Guide Ã‚Â§Task 3.1

---

### q029 — Task 3.2

**Scenario:** The monolithic CLAUDE.md is difficult to maintain. Different team members need to update different sections, and merge conflicts are common.

**Question:** A team's CLAUDE.md file has grown to over 500 lines covering multiple concerns: code style, testing conventions, deployment steps, and architectural decisions. How should this be organized for maintainability?

**Options:**

A. Move all content to a separate wiki page and reference it in CLAUDE.md

B. Keep everything in one file but add section headers with descriptive comments

C. **[✓]** Use the import syntax to compose separate files into the main CLAUDE.md file

D. Create a separate CLAUDE.md file in each subdirectory of the project

**Correct Answer:** C

**Explanation:** The @import syntax allows modular CLAUDE.md configuration by importing content from separate files (e.g., @import ./style-guide.md). This enables teams to maintain focused, independently-editable files that are composed together at load time. This improves maintainability, reduces merge conflicts, and follows good software modularity principles.

**Source:** Exam Guide Ã‚Â§Task 3.2

---

### q030 — Task 3.3

**Scenario:** The team has standardized CLI commands for common operations and wants Claude Code to be able to run them reliably within a project context.

**Question:** A team wants to create reusable project-scoped commands for common workflows like 'lint', 'test', and 'deploy' that can be invoked during Claude Code sessions. What is the correct approach?

**Options:**

A. Add shell aliases to each individual developer bashrc configuration file directly

B. **[✓]** Place executable scripts in the project claude commands directory for reuse

C. Document the commands in a README and ask developers to run them manually

D. Create a CLAUDE.md section that lists the commands for the model

**Correct Answer:** B

**Explanation:** Project-scoped commands should be placed in the .claude/commands/ directory. Commands placed there become available to Claude Code within that project context. They can be invoked by name and support structured execution with defined inputs and outputs, making them more reliable than prompt-based command execution.

**Source:** Exam Guide Ã‚Â§Task 3.3

---

### q031 — Task 3.4

**Scenario:** The skill takes user specifications and generates code snippets. Each invocation must start fresh without retaining state from previous uses.

**Question:** An architect is building a skill that should process user input and generate isolated output without leaking context between invocations. What configuration mechanism supports this isolation?

**Options:**

A. Include instructions in the skill description telling users to clear the context manually

B. Design the skill to run as a completely separate MCP server process

C. **[✓]** Configure context fork in the skill frontmatter to isolate each invocation session

D. Add a system prompt that resets all variables at the start of each invocation

**Correct Answer:** C

**Explanation:** The context: fork frontmatter directive in a skill's configuration ensures each invocation creates an isolated session fork. This prevents context leakage between invocations, ensures clean state for each use, and maintains the main session's context uncontaminated by skill operations. It is the proper mechanism for output isolation.

**Source:** Exam Guide Ã‚Â§Task 3.4

---

### q032 — Task 3.5

**Scenario:** The project is a full-stack application with React frontend, Node.js backend, and Python data processing scripts. Each area has different conventions.

**Question:** A development team needs conditional rules that apply only when working on specific parts of a project (e.g., frontend rules when editing React components, backend rules when editing API routes). How should this be configured?

**Options:**

A. Put all rules in a single CLAUDE.md with conditional phrasing about the frontend

B. **[✓]** Use claude rules with YAML frontmatter containing path patterns for conditional activation

C. Create separate CLAUDE.md files in each directory and let them override one another

D. Define all the rules in the project settings file with appropriate conditional flags

**Correct Answer:** B

**Explanation:** The .claude/rules/ directory supports files with YAML frontmatter that specify path patterns. Rules are conditionally applied when the current file matches the specified paths. This is the correct mechanism for context-sensitive, conditional rules that activate only when relevant to the current task.

**Source:** Exam Guide Ã‚Â§Task 3.5

---

### q033 — Task 3.6

**Scenario:** The change is straightforward: renaming 'cachExpiry' to 'cacheExpiry' in a single configuration file. No other files are affected.

**Question:** A developer needs to fix a typo in a single variable name across one file. What is the appropriate execution mode for this task?

**Options:**

A. Use Plan mode to analyze the impact before making any changes at all

B. Use batch processing to handle the change as part of a larger batch

C. Create a new session fork to explore the change approach first

D. **[✓]** Use direct execution mode to make the change immediately without separate planning

**Correct Answer:** D

**Explanation:** For simple, single-file changes with clearly bounded impact, direct execution is the most appropriate mode. Plan mode adds unnecessary overhead for trivial changes that do not require architectural analysis. The developer should match the execution mode to the complexity of the task.

**Source:** Exam Guide Ã‚Â§Task 3.6

---

### q034 — Task 3.7

**Scenario:** The restructuring affects 40+ files across 8 packages. The approach needs careful planning to ensure correct dependency management.

**Question:** A developer needs to restructure a monolithic application into a microservices architecture, which involves creating new packages, extracting interfaces, and updating cross-module imports. What execution mode is most appropriate?

**Options:**

A. Execute all changes directly in one session since the developer knows what to do

B. Use batch mode to submit all changes as a single non-blocking batch request

C. Make changes file by file without a global plan letting the model adapt as needed

D. **[✓]** Use Plan mode to analyze the architecture and design the target structure before execution

**Correct Answer:** D

**Explanation:** Plan mode is the correct choice for large-scale multi-file restructuring. It allows the agent to first analyze the current architecture, design the target structure, identify dependencies, and present a plan to the developer. After plan approval, execution can proceed with confidence. Direct execution on complex restructurings risks incomplete or inconsistent changes.

**Source:** Exam Guide Ã‚Â§Task 3.7

---

### q035 — Task 3.8

**Scenario:** The agent generates code review findings. Most reports follow the required format, but about 15% deviate, requiring manual reformatting.

**Question:** A team needs the agent to consistently output error reports in a specific structure: severity, file location, description, and suggested fix. The model occasionally deviates from this format. What technique improves consistency?

**Options:**

A. Add stricter instructions in the system prompt telling the model to follow the format

B. Remove all strict formatting requirements and accept whatever format the model produces

C. **[✓]** Provide concrete before and after examples in the prompt showing correct formatting

D. Ask developers to manually fix the formatting issues during their review process

**Correct Answer:** C

**Explanation:** Concrete before/after examples are more effective than abstract formatting instructions. Showing the model examples of what correct output looks like for different scenarios anchors its understanding. This is particularly important for structured output where the model needs to map abstract rules to concrete formats consistently.

**Source:** Exam Guide Ã‚Â§Task 3.8

---

### q036 — Task 3.9

**Scenario:** The request is: 'Add an endpoint that allows users to delete their account.' There are many edge cases: active subscriptions, owned content, pending transactions, team memberships.

**Question:** A developer requests a new API endpoint. Before writing any code, what technique helps surface edge cases and potential issues?

**Options:**

A. Proceed directly to the implementation since the request seems quite straightforward overall

B. Create a comprehensive implementation that handles all possible edge cases up front

C. Build a basic implementation and test it iteratively as issues are discovered

D. **[✓]** Use the interview pattern to ask targeted questions about edge cases before coding

**Correct Answer:** D

**Explanation:** The interview pattern involves asking targeted questions about edge cases, constraints, and business rules before any coding begins. This surfaces requirements that the developer may not have explicitly stated (like 'what happens to subscriptions on account deletion?'). It prevents wasted effort on implementations that miss critical requirements and is more efficient than iterative refinement.

**Source:** Exam Guide Ã‚Â§Task 3.9

---

### q037 — Task 3.10

**Scenario:** The pipeline runs on every PR and needs Claude Code to analyze changes and post comments, then exit automatically.

**Question:** A CI/CD pipeline needs to run Claude Code to generate automated code review comments on pull requests. The pipeline should not block waiting for interactive input. What flag enables this?

**Options:**

A. Use the interactive flag to keep the session open for debugging purposes

B. **[✓]** Use the print flag for non-interactive mode suitable for CI/CD pipelines

C. Use the verbose flag to get detailed output from the session

D. Use the resume flag to continue a previous session from before

**Correct Answer:** B

**Explanation:** The -p or --print flag runs Claude Code in non-interactive mode, which reads input from stdin and prints output to stdout without entering an interactive loop. This is designed for CI/CD pipelines and automated workflows where no human interaction is available.

**Source:** Exam Guide Ã‚Â§Task 3.10

---

### q038 — Task 3.11

**Scenario:** The agent generates review comments on every run. When a developer pushes new commits, the agent re-reviews the entire diff and re-reports previously identified issues that have already been fixed or acknowledged.

**Question:** An automated CI/CD pipeline runs Claude Code to perform code reviews. When the same PR is updated and re-reviewed, the agent repeats previously reported findings. How should this be addressed?

**Options:**

A. Accept that repeated findings are expected and ask developers to ignore already fixed items

B. **[✓]** Include prior review findings in the context so the agent can skip already addressed issues

C. Run the review only on the diff between the current commit and the previous one

D. Reduce the scope of the review to focus only on the most critical issues

**Correct Answer:** B

**Explanation:** Including prior review findings in the context enables the agent to perform deduplication. By knowing what was previously reported, the agent can skip already-fixed issues and focus only on new or remaining concerns. This requires passing the previous review output as part of the input context for the re-run.

**Source:** Exam Guide Ã‚Â§Task 3.11

---

### q039 — Task 3.12

**Scenario:** The application needs to run linting, type checking, security scanning, and dependency audit as separate tasks that can be collected up to 24 hours later.

**Question:** An application needs to submit multiple independent code analysis tasks and collect results later without blocking the main workflow. Which API approach is most appropriate?

**Options:**

A. Use synchronous API calls for each individual task in sequence

B. **[✓]** Use the Message Batches API for non-blocking submission with deferred collection

C. Use streaming API with parallel connections for each separate task

D. Use a single synchronous call that combines all the analyses together

**Correct Answer:** B

**Explanation:** The Message Batches API is designed for non-blocking workflows where results can be collected later. It accepts batch submissions and processes them asynchronously, which is ideal for tasks with flexible SLAs. Synchronous APIs would block the main workflow, and streaming does not inherently support deferred collection.

**Source:** Exam Guide Ã‚Â§Task 3.12

---

### q088 — Task 3.1

**Scenario:** The user-level CLAUDE.md specifies 4-space indentation, the project-level CLAUDE.md specifies 2-space indentation, and a subdirectory-level .claude/config specifies tab indentation.

**Question:** A team has configuration at the user level, project level, and directory level that may conflict. What is the correct resolution order when the same setting appears at multiple levels?

**Options:**

A. All levels are ignored and only the system default configuration applies

B. Project-level configuration always takes priority since it represents team standards

C. User-level configuration always takes priority since it represents developer preference

D. **[✓]** The directory level takes highest priority over project and user level settings

**Correct Answer:** D

**Explanation:** The CLAUDE.md hierarchy follows a specificity-based priority: directory-level overrides project-level, which overrides user-level. This allows teams to set base conventions at the project level while allowing more specific overrides in subdirectories. User-level settings are the baseline and are overridden by more specific project or directory settings.

**Source:** Exam Guide Ã‚Â§Task 3.1

---

### q089 — Task 3.2

**Scenario:** The team has common workflows: 'summarize PR', 'generate changelog', 'run full test suite with coverage', and 'deploy to staging'. They want these as reusable commands.

**Question:** A team wants to create custom slash commands that team members can share and reuse across projects. What is the correct approach for creating and distributing custom commands?

**Options:**

A. Document the workflows in a wiki page and have developers type them manually

B. **[✓]** Create command scripts in the project claude commands directory for version-controlled sharing

C. Create shell aliases in each developer shell configuration file directly for consistency

D. Hard-code the workflows into the agent system prompt for easy reuse later

**Correct Answer:** B

**Explanation:** Custom slash command creation and sharing is done through the .claude/commands/ directory at the project level. These command scripts are version-controlled, making them shareable with the entire team through the repository. They support structured inputs and outputs, making them more powerful and reliable than prompt-based workflows or shell aliases.

**Source:** Exam Guide Ã‚Â§Task 3.2

---

### q090 — Task 3.3

**Scenario:** The skill needs specific instructions about coverage thresholds, report format, and tool access. It should not interfere with the main session's context.

**Question:** A developer wants to create a reusable skill that analyzes test coverage and generates reports. The skill should have its own instructions isolated from the main session. What configuration approach is correct?

**Options:**

A. Add all instructions to the CLAUDE.md file at the project root

B. **[✓]** Create a skill with a SKILL.md file using context fork for instruction isolation

C. Put the instructions in the system prompt each time the skill is invoked

D. Create a separate CLAUDE.md file for the skill instructions instead of this

**Correct Answer:** B

**Explanation:** Skill development uses SKILL.md with YAML frontmatter that defines the skill's metadata, including context: fork for isolation. The skill body contains specialized instructions. When invoked, the skill runs in its own forked context, keeping the main session uncontaminated. This is the proper mechanism for creating reusable, isolated capabilities.

**Source:** Exam Guide Ã‚Â§Task 3.3

---

### q091 — Task 3.6

**Scenario:** The transformation involves cleaning data, validating schemas, and generating summary statistics. The files are independent and can be processed concurrently.

**Question:** A data engineering team needs to process 50 large CSV files through a transformation pipeline. Each file takes about 2 minutes to process. What is the recommended approach for batch processing?

**Options:**

A. Process all fifty files one after another sequentially in a single session

B. **[✓]** Use batch processing with parallel task execution using the Task tool for concurrency

C. Process all the files manually using a spreadsheet application one by one

D. Process one file at a time and manually restart for each file

**Correct Answer:** B

**Explanation:** Batch processing with parallel Task tool invocations is the correct approach for independent file transformations. Multiple files can be processed concurrently by spawning parallel subagent tasks, dramatically reducing total wall-clock time. Sequential processing would take 100 minutes, while 10 parallel tasks could complete in approximately 10 minutes.

**Source:** Exam Guide Ã‚Â§Task 3.6

---

### q092 — Task 3.7

**Scenario:** The frontend uses ESLint + Prettier, the API uses ESLint + Jest, shared types have no tooling, and deployment uses shell scripts. Different rules apply when working in each package.

**Question:** A team works on a monorepo containing multiple packages: a React frontend, a Node.js API, shared TypeScript types, and deployment scripts. Each package has different conventions and tools. How should Claude Code be configured for this monorepo?

**Options:**

A. Use a single global CLAUDE.md with all rules and let the model decide

B. **[✓]** Use directory-level claude configurations with path-pattern frontmatter for package-specific conditional rules

C. Create a separate CLAUDE.md in each package directory that duplicates common rules

D. Put all the rules in the claude settings file with conditional logic applied

**Correct Answer:** B

**Explanation:** For monorepos, use directory-level configuration and conditional rules via .claude/rules/ with path-pattern frontmatter. This allows each package to have its own conventions, tools, and rules that activate only when working within that package. Duplicating rules in separate CLAUDE.md files creates maintenance burden, and a single global configuration is too coarse.

**Source:** Exam Guide Ã‚Â§Task 3.7

---

### q093 — Task 3.8

**Scenario:** The developer wants to set default model, temperature, and output preferences that apply everywhere, not just in one project.

**Question:** A team needs to configure Claude Code behavior settings that apply across all projects on a developer's machine. What file should they use?

**Options:**

A. Add the settings to each project claude directory separately as needed

B. **[✓]** Use claude settings at the user level for global configuration across all projects

C. Set specific environment variables for your Claude Code configuration file preferences

D. Configure the settings in the IDE extension settings panel for Claude

**Correct Answer:** B

**Explanation:** The .claude/settings.json file at the user level (typically ~/.claude/settings.json) contains global configuration that applies across all projects. This is the correct location for user-wide preferences like default model selection, temperature settings, and output preferences. Project-level settings override user-level settings for project-specific configuration.

**Source:** Exam Guide Ã‚Â§Task 3.8

---

### q094 — Task 3.9

**Scenario:** The chat assistant needs responses within 2 seconds. The batch analysis system processes files asynchronously and has no time pressure.

**Question:** A development team is configuring the agent SDK for different use cases: a real-time chat assistant needs low latency, while a batch code analysis system prioritizes throughput. How should agent SDK configuration differ?

**Options:**

A. Use the same configuration for both since the SDK handles optimization automatically

B. **[✓]** Configure the agent SDK with different settings per use case for optimal performance

C. Only use the agent SDK for the chat assistant and build the batch manually

D. Use the default configuration for everything since defaults are optimized for all cases

**Correct Answer:** B

**Explanation:** Agent SDK configuration should be tailored to each use case. The chat assistant needs: lower temperature for consistency, streaming for real-time responses, and potentially a faster but less capable model. The batch system needs: higher parallelism for throughput, non-streaming for efficiency, and batch processing capabilities. One-size-fits-all configuration does not optimize for different requirements.

**Source:** Exam Guide Ã‚Â§Task 3.9

---

### q095 — Task 3.10

**Scenario:** The organization has 20 developers who each need API keys. Keys must be managed securely without being exposed in code or version control.

**Question:** An organization needs to configure API keys for Claude Code across multiple developer machines. What is the correct approach for API key management?

**Options:**

A. Hard-code the API key in each project CLAUDE.md for developer convenience

B. Embed the API key in the project package.json as a script configuration

C. Share a single API key among all developers in a shared configuration file

D. **[✓]** Use environment variables for API keys keeping them out of version-controlled files

**Correct Answer:** D

**Explanation:** Claude Code authentication and API key management should use environment variables (like ANTHROPIC_API_KEY) or the Claude Code settings system. API keys must never be committed to version control or stored in project configuration files that are shared. Each developer should have their own key or keys should be managed through a secure secrets manager.

**Source:** Exam Guide Ã‚Â§Task 3.10

---

### q096 — Task 3.11

**Scenario:** Claude Code made changes to 15 files in a refactoring session. The developer needs to understand what changed, verify correctness, and accept or reject specific changes.

**Question:** A developer is reviewing a large diff produced by Claude Code. How should they efficiently review and manage the proposed changes?

**Options:**

A. Accept all changes blindly since the agent was told to do the right thing

B. **[✓]** Use the diff view to review each change and selectively accept or modify before finalizing

C. Reject all of the changes and completely redo the work manually from scratch

D. Only check if the tests pass and accept regardless of what the diff shows

**Correct Answer:** B

**Explanation:** File change management and diff handling should follow a structured review process: (1) review the diff for each file to understand what changed and why, (2) ask for explanations of specific modifications if needed, (3) request modifications for changes that look incorrect or suboptimal, and (4) selectively accept changes. Blind acceptance is risky; blanket rejection wastes effort.

**Source:** Exam Guide Ã‚Â§Task 3.11

---

### q097 — Task 3.12

**Scenario:** The pipeline runs on every PR and has access to the repository, secrets, and deployment credentials. It uses Claude Code to suggest fixes for linting errors.

**Question:** A CI/CD pipeline needs to run Claude Code for automated code generation tasks. What permissions and security considerations are most important?

**Options:**

A. Give Claude Code full access to all repository secrets and credentials available

B. Grant Claude Code write access to the production environment directly without review

C. Run Claude Code on a separate secured server with unlimited access permissions

D. **[✓]** Run Claude Code with minimal permissions restrict file access and avoid exposing secrets

**Correct Answer:** D

**Explanation:** Claude Code in CI/CD pipelines requires strict security: (1) use the -p flag for non-interactive mode, (2) grant minimal permissions needed for the task, (3) restrict file system access to the repository, (4) never expose secrets to the agent's context, and (5) ensure the agent cannot access production environments. CI/CD is a high-risk environment for agent execution.

**Source:** Exam Guide Ã‚Â§Task 3.12

---

### q098 — Task 3.13

**Scenario:** The project contains configuration files with secrets (which should never be read) and source code (which should be editable).

**Question:** A team wants to control which files Claude Code can access and modify in a sensitive project. What configuration mechanism should they use?

**Options:**

A. Trust the model not to access the sensitive files at all

B. Move sensitive files to a completely separate directory location instead

C. **[✓]** Configure allow and deny lists for file access in the security settings

D. Encrypt sensitive files so the model cannot successfully read them

**Correct Answer:** C

**Explanation:** Claude Code permissions and security settings support configuring file system access controls, including allow lists and deny lists. This programmatically prevents the agent from reading or writing specific files or directories. This is essential for projects containing secrets, configuration files, or other sensitive data that should not be exposed to the agent.

**Source:** Exam Guide Ã‚Â§Task 3.13

---

### q099 — Task 3.14

**Scenario:** The team wants to log all tool calls, validate inputs, enforce rate limits, and track usage metrics across all agents.

**Question:** A team needs to run custom logic before and after every Claude Code tool execution. What mechanism supports this?

**Options:**

A. Implement this custom logic in each individual tool implementation process manually

B. Ask the developers to manually log their tool usage and activity each day

C. **[✓]** Use the hooks system provided by the agent SDK for custom event handlers

D. Use a network proxy to intercept all tool calls externally from the system

**Correct Answer:** C

**Explanation:** Custom hooks and event handlers provided by the agent SDK (PreToolUse, PostToolUse) are the correct mechanism for running logic before and after tool executions. These hooks are centralized, apply to all tools automatically, and cannot be bypassed. They support logging, validation, transformation, and interception use cases without modifying individual tool implementations.

**Source:** Exam Guide Ã‚Â§Task 3.14

---

## D4: Prompt Engineering & Structured Output (26 questions)

### q040 — Task 4.1

**Scenario:** The agent's PR reviews average 30+ comments per 100 lines changed, covering everything from serious bugs to personal preferences about naming conventions.

**Question:** A team uses an agent to perform PR reviews. The reviewer provides detailed feedback on every line of code, including minor stylistic preferences that are not team standards. The volume of feedback causes review fatigue. How should the PR review criteria be structured?

**Options:**

A. Tell the agent to reduce the number of comments without any specific guidance

B. Limit the review to a maximum of five comments total per pull request

C. **[✓]** Define explicit categorical criteria listing what to report and what to skip for quality

D. Remove the PR review capability entirely and rely on manual reviews instead

**Correct Answer:** C

**Explanation:** Explicit categorical criteria are essential for effective PR reviews. The criteria should list what to report (functional bugs, security vulnerabilities, API compatibility breaks, performance issues) and what to skip (formatting preferences, naming style choices, minor refactoring suggestions). This focuses the review on high-value findings and reduces noise that causes review fatigue.

**Source:** Exam Guide Ã‚Â§Task 4.1

---

### q041 — Task 4.2

**Scenario:** The agent processes CSV files and needs to check for: missing values, type mismatches, encoding issues, and boundary conditions. It handles missing values but often misses boundary conditions.

**Question:** An agent is asked to verify that a data processing pipeline handles all edge cases correctly. The prompt says 'check for edge cases' but the agent consistently misses specific types of edge cases. What is the root cause?

**Options:**

A. The model is not intelligent enough to understand what edge cases fully are

B. **[✓]** The prompt uses vague language instead of listing explicit criteria like verify boundary values

C. The agent needs a much larger model to handle effective edge case detection

D. Edge case detection requires a separate fine-tuned model for this specific task

**Correct Answer:** B

**Explanation:** The vague instruction 'check for edge cases' should be replaced with explicit criteria. For example, specify 'check for contradiction between source and target fields' or 'verify values at minimum and maximum numeric boundaries'. The model performs better with specific, actionable instructions than with abstract concepts that may have ambiguous interpretations.

**Source:** Exam Guide Ã‚Â§Task 4.2

---

### q042 — Task 4.3

**Scenario:** The instructions specify a multi-section report with severity, affected component, description, and remediation. The format is correct about 85% of the time.

**Question:** Despite detailed instructions about output format, the agent occasionally deviates from the required structure when generating complex technical reports. What technique should be employed?

**Options:**

A. Accept the eighty five percent success rate and fix remaining cases manually

B. **[✓]** Add few-shot examples of correctly formatted reports to the prompt as reference patterns

C. Simplify the report format to reduce the overall chance of format deviation

D. Increase the model temperature to encourage more careful output generation behavior

**Correct Answer:** B

**Explanation:** When instructions alone fail to produce consistent output, few-shot examples are the most effective solution. Providing 2-3 concrete examples of correctly formatted reports anchors the model's output to the expected pattern. Examples work better than additional instructions because they demonstrate rather than describe the expected format.

**Source:** Exam Guide Ã‚Â§Task 4.3

---

### q043 — Task 4.4

**Scenario:** The pipeline extracts invoice data (invoice number, date, line items, totals) from PDF text. Downstream systems require strict JSON structure with specific field names and types.

**Question:** A team builds a structured data extraction pipeline that uses tool_use with a JSON schema containing required fields for invoice total vendor name and invoice date and an optional purchase order number field. During validation the team discovers that invoices without purchase order numbers consistently contain fabricated values like N-A or PO-00000 instead of null. Which schema design change would most effectively eliminate this hallucination?

**Options:**

A. **[✓]** Make the purchase order number field nullable with schema description guidance to return null when the field is absent

B. Remove the purchase order number field from the schema entirely and extract it through a separate validation pass if needed

C. Add enum validation to the purchase order number field restricting values to patterns matching valid purchase order formats

D. Set the purchase order number field as required with a null default value to enforce null returns when the information is absent

**Correct Answer:** A

**Explanation:** Schema fields should be designed as nullable when source documents may not contain the information, preventing the model from fabricating values to satisfy required fields. Making the purchase order number field explicitly nullable in the schema definition with clear description guidance tells the model that null is an acceptable and expected value when the information is absent from the source document.

**Source:** Exam Guide Ã‚Â§Task 4.4

---

### q044 — Task 4.5

**Scenario:** The schema requires fields like invoice_date (string), total_amount (number), and line_items (array). The model always returns valid JSON matching this schema.

**Question:** A JSON schema is used to enforce the structure of extracted data from documents. What does schema enforcement guarantee, and what does it not guarantee?

**Options:**

A. Schema enforcement always guarantees both syntactic validity and semantic correctness of data

B. **[✓]** Schema enforcement prevents syntax errors but does not prevent semantic data errors

C. Schema enforcement only guarantees the JSON is valid not that fields are correct

D. Schema enforcement is redundant because the model always produces correct output

**Correct Answer:** B

**Explanation:** Schema enforcement prevents syntax errors (invalid JSON, wrong types, missing required fields) but does not prevent semantic errors. The model could return the correct structure with incorrect values: a wrong invoice number, an incorrectly calculated total, or a date that does not match the document. Semantic validation requires additional verification steps beyond schema checking.

**Source:** Exam Guide Ã‚Â§Task 4.5

---

### q045 — Task 4.6

**Scenario:** The agent sometimes returns invoice data as free-text JSON in the assistant message instead of calling the designated tool, which breaks downstream processing.

**Question:** An extraction agent processes invoices and must always call the 'extract_invoice' tool, even when the model might consider directly answering in text. How can this be enforced?

**Options:**

A. Add a system prompt instruction telling the model to always use the specific tool

B. Remove all other tools from the configuration so the model has no alternative

C. **[✓]** Use tool_choice with type tool and name extract_invoice to force that specific tool

D. Process both text responses and tool call outputs as equally valid results

**Correct Answer:** C

**Explanation:** Forced tool selection via tool_choice: {type: 'tool', name: 'extract_invoice'} ensures the model must call the specified tool. This overrides the model's default behavior and guarantees structured output through the tool. Prompt instructions alone can be ignored by the model, but tool_choice with 'tool' type is programmatic and cannot be bypassed.

**Source:** Exam Guide Ã‚Â§Task 4.6

---

### q046 — Task 4.7

**Scenario:** About 8% of extractions produce JSON with syntax errors like trailing commas or unquoted keys. The agent needs to recover without human intervention.

**Question:** A data extraction agent sometimes returns malformed JSON when extracting invoice data. What is the appropriate recovery strategy?

**Options:**

A. Accept the failed extractions and log them for manual processing later

B. **[✓]** Retry the extraction with malformed output included as error feedback for correction

C. Ignore the format errors since the data set is probably still usable

D. Switch to a completely different extraction approach for this scenario

**Correct Answer:** B

**Explanation:** When format errors occur, the agent should retry with error feedback. Include the malformed output and a description of the error (e.g., 'The JSON had a trailing comma after the last array element. Please fix and retry.'). The model can typically correct its output when given specific error feedback. This recovery loop is more efficient than manual reprocessing.

**Source:** Exam Guide Ã‚Â§Task 4.7

---

### q047 — Task 4.8

**Scenario:** The invoice format from a specific vendor does not include a tax ID field at all. The extraction is attempted 5 times with different prompting strategies, all failing.

**Question:** A document extraction agent consistently fails to extract the 'vendor_tax_id' field from certain invoices. Retrying with error feedback does not help. What is the most likely root cause?

**Options:**

A. The model is not capable of finding tax identifiers in this format

B. The extraction tool schema is far too restrictive and needs loosening

C. **[✓]** Retries are ineffective when the required information is absent from the source

D. The model temperature setting is too low for accurate extraction work

**Correct Answer:** C

**Explanation:** Retries with error feedback are ineffective when the required information is simply not present in the source document. No amount of retrying will extract a tax ID that was never printed on the invoice. The system should detect this situation by validating that the required fields actually exist in the source before retrying, and handle missing data gracefully (e.g., mark as 'not available' rather than retrying endlessly).

**Source:** Exam Guide Ã‚Â§Task 4.8

---

### q048 — Task 4.9

**Scenario:** The processing must complete within 36 hours. Each report takes ~1 minute of processing time. The team has a budget-conscious approach and can accept processing starting within a few hours.

**Question:** A compliance team needs to process 10,000 quarterly reports with a 36-hour turnaround SLA. Each report requires complex analysis that takes approximately 1 minute. What submission strategy is optimal?

**Options:**

A. Process reports one at a time synchronously over ten thousand minutes

B. Use streaming for all ten thousand requests in parallel simultaneously

C. Submit all ten thousand reports simultaneously in individual API requests

D. **[✓]** Use a batch submission strategy within a twenty four hour SLA window

**Correct Answer:** D

**Explanation:** A batch submission strategy with a 24-hour maximum window is appropriate. Batch processing allows submitting all 10,000 reports at once with results available within 24 hours, well within the 36-hour SLA. This is far more efficient than sequential processing and avoids rate limiting issues. The window should be configured to ensure completion before the SLA deadline.

**Source:** Exam Guide Ã‚Â§Task 4.9

---

### q049 — Task 4.10

**Scenario:** The CI pipeline needs to block the merge until the review is complete. The developer has a 10-minute SLA for merge checks.

**Question:** A developer wants to use the Message Batches API for a pre-merge code review gate that must block the merge pipeline until results are available. Is this appropriate?

**Options:**

A. Yes the Message Batches API is designed for all types of review workflows

B. **[✓]** No the Message Batches API is inappropriate for blocking pre-merge workflows entirely

C. Yes as long as the batch window is set below the required ten minutes

D. No because batch processing is not capable of handling code review tasks

**Correct Answer:** B

**Explanation:** The Message Batches API is designed for non-blocking, asynchronous processing with deferred result collection. It is inappropriate for blocking/pre-merge workflows where results are needed synchronously to gate a pipeline. For blocking workflows, use synchronous API calls or streaming to get results inline before proceeding with the merge decision.

**Source:** Exam Guide Ã‚Â§Task 4.10

---

### q050 — Task 4.11

**Scenario:** The developer writes a complex algorithm and then asks the same agent to check for bugs and edge cases in the implementation.

**Question:** A developer uses Claude Code to review their own code changes before committing. They ask the same session to review the code it just wrote. What is the limitation of this approach?

**Options:**

A. There is no limitation the same session can effectively self-review its own work

B. **[✓]** Self-review in the same session suffers from confirmation bias and shared context blindness

C. The model does not have the capability to review code at all effectively

D. Self-review is only effective approach when using a completely different model

**Correct Answer:** B

**Explanation:** Self-review within the same session suffers from confirmation bias and shared context blindness Ã¢â‚¬â€ the agent is operating with the same assumptions that led to the original implementation. An independent instance (separate session or separate agent) with a fresh perspective and no shared assumptions is significantly more effective at identifying issues and edge cases.

**Source:** Exam Guide Ã‚Â§Task 4.11

---

### q051 — Task 4.12

**Scenario:** The review system must both identify correctness issues and explore edge cases. Single-pass approaches tend to favor one or the other.

**Question:** A team is building a code review system that generates comprehensive reports. They notice that the agent either produces thorough reviews but misses some edge cases, or generates great edge case analysis but with inconsistent coverage. What architectural pattern addresses this?

**Options:**

A. Use a much larger model to handle both types of tasks simultaneously

B. Combine both concerns into a single comprehensive detailed system prompt

C. **[✓]** Use a multi-pass architecture with separate passes for review and edge cases

D. Use random sampling to cover different aspects in each separate pass

**Correct Answer:** C

**Explanation:** A multi-pass architecture separates concerns across different passes: one pass focuses on general implementation correctness, and a separate pass focuses specifically on edge case identification. Each pass has a focused objective and criteria. This separation produces more thorough coverage than trying to handle all concerns in a single pass, where attention is divided.

**Source:** Exam Guide Ã‚Â§Task 4.12

---

### q100 — Task 4.1

**Scenario:** The system has a coordinator agent and 5 specialist agents, each with different responsibilities and tool access.

**Question:** An architect is designing prompts for a multi-agent system. What is the most important principle for system prompt design in this context?

**Options:**

A. Use the same system prompt for all agents to maintain consistency

B. Use the system prompt only for formatting instructions not behavioral guidance

C. Keep system prompts as short as possible ideally just one sentence

D. **[✓]** Design role-specific system prompts that clearly define each agent purpose and guidelines

**Correct Answer:** D

**Explanation:** System prompt design principles require role-specific prompts that clearly define: (1) the agent's purpose and role in the system, (2) its capabilities and tools, (3) its limitations and boundaries (what it should not do), and (4) behavioral guidelines for interaction. Each agent needs a prompt tailored to its function. A one-size-fits-all approach leads to role confusion and boundary violations.

**Source:** Exam Guide Ã‚Â§Task 4.1

---

### q101 — Task 4.2

**Scenario:** The conversation involves the user providing requirements, the model asking clarifying questions, and the user answering. The model needs to track who said what.

**Question:** An architect is designing a conversation flow where the model needs to understand the difference between user-provided information and its own previous responses. How should messages be structured?

**Options:**

A. Put all the messages in a single array without any role distinctions

B. Use a single message that concatenates the entire conversation together as one

C. Mark all messages as user messages for simplicity in the structure

D. **[✓]** Use proper message roles for user assistant and system in all messages

**Correct Answer:** D

**Explanation:** Using proper user turn vs assistant turn message roles is essential for the model to correctly attribute information. The user role represents human-provided information, the assistant role represents the model's own previous responses, and the system role provides instructions. This role structure is fundamental to the model's understanding of conversation context and who said what.

**Source:** Exam Guide Ã‚Â§Task 4.2

---

### q102 — Task 4.3

**Scenario:** The prompt includes: role definition (2 paragraphs), task instructions (3 bullet points), example inputs and outputs (5 examples), and output format requirements (4 specifications).

**Question:** An architect needs to structure a complex prompt with multiple sections: instructions, context, examples, and output format specifications. What structuring approach improves model comprehension?

**Options:**

A. Write everything in a single paragraph to save on tokens

B. **[✓]** Use XML tags like instructions context and examples to delineate prompt sections

C. Use random separators like dashes between the different sections of the prompt

D. Put each different section in a separate message turn instead

**Correct Answer:** B

**Explanation:** XML tagging for structured prompts uses descriptive tags like &lt;instructions&gt;, &lt;context&gt;, &lt;examples&gt;, and &lt;output-format&gt; to clearly delineate sections. This improves the model's ability to parse and reference different parts of the prompt. XML tags are well-understood by the model and provide clear section boundaries that support reference (e.g., 'following the format specified in &lt;output-format&gt;').

**Source:** Exam Guide Ã‚Â§Task 4.3

---

### q103 — Task 4.4

**Scenario:** The task requires: analyzing a system architecture, identifying potential failure modes, evaluating their impact, and recommending mitigations.

**Question:** An architect is designing a prompt for complex multi-step reasoning. The model should show its reasoning process before arriving at a conclusion. What prompting technique supports this?

**Options:**

A. Ask the model to provide only the final recommendation without showing work

B. Ask the model to guess the correct answer quickly since reasoning takes too long

C. Use a single instruction telling the model to be correct at all times

D. **[✓]** Use chain-of-thought prompting to encourage the model to reason step-by-step before concluding

**Correct Answer:** D

**Explanation:** Chain-of-thought prompting encourages the model to break down complex reasoning into explicit steps before arriving at conclusions. This produces more accurate results for multi-step analysis tasks and makes the reasoning transparent. The model should be prompted to show its analytical process, consider alternatives, and then present conclusions with supporting evidence.

**Source:** Exam Guide Ã‚Â§Task 4.4

---

### q104 — Task 4.5

**Scenario:** A user asks a question, the assistant responds, the user asks a follow-up that shifts the topic slightly, then clarifies their original intent.

**Question:** A conversational AI system needs to maintain coherent context across multiple user turns while handling topic shifts and clarifications. What is the correct approach to multi-turn conversation management?

**Options:**

A. Treat each user message as an independent request without considering prior context

B. Reset the conversation after every three turns to keep context fresh

C. Only keep the last user message and discard all of the history

D. **[✓]** Maintain conversation history as message sequences with proper roles and context management

**Correct Answer:** D

**Explanation:** Multi-turn conversation management requires maintaining the structured conversation history (user and assistant messages) across turns. The agent needs to understand the full context, handle topic shifts gracefully, and manage the context window by summarizing older turns or pruning irrelevant content. Discarding history or treating each turn independently loses the conversational context needed for coherent responses.

**Source:** Exam Guide Ã‚Â§Task 4.5

---

### q105 — Task 4.6

**Scenario:** The chatbot has access to customer data and can perform actions like looking up orders and processing returns. The system prompt instructs it to follow company policies.

**Question:** A team is building an AI-powered customer-facing chatbot. What measures should be taken to prevent users from manipulating the system prompt through crafted inputs?

**Options:**

A. No measures are needed since the model can detect manipulation attempts itself

B. Tell users not to attempt prompt injection in the welcome message shown

C. **[✓]** Validate user inputs constrain model instructions and never expose tool capabilities to users

D. Remove all instructions from the system prompt so there is nothing to manipulate

**Correct Answer:** C

**Explanation:** Prompt injection prevention requires: (1) validate and sanitize user inputs before they reach the model, (2) constrain the model's behavior through the system prompt with explicit boundaries, (3) never expose tool names or capabilities in user-visible responses, (4) use input/output guards that filter suspicious patterns, and (5) implement the principle of least privilege for tool access.

**Source:** Exam Guide Ã‚Â§Task 4.6

---

### q106 — Task 4.7

**Scenario:** The task is generating boilerplate code from templates where consistency is more important than creativity.

**Question:** An architect is configuring the model parameters for a code generation task that requires highly deterministic output. The system should produce the same output for the same input every time. What configuration is most appropriate?

**Options:**

A. Set high temperature and high top p values for maximum output diversity

B. Temperature and top p settings do not affect output determinism at all

C. Set temperature to maximum for creativity since code generation needs variety

D. **[✓]** Set temperature to zero and top p to one for maximum output determinism

**Correct Answer:** D

**Explanation:** For deterministic output, set temperature to 0 (or very close to 0) and top_p to 1. Temperature controls the randomness of token selection: 0 makes the model always choose the most likely token, producing consistent output. Top_p is an alternative sampling method; setting it to 1 disables its effect. For creative tasks, higher values are appropriate, but for deterministic code generation, low temperature is correct.

**Source:** Exam Guide Ã‚Â§Task 4.7

---

### q107 — Task 4.8

**Scenario:** The code review summary should be concise enough to fit in a PR comment with a 500-token limit. The model sometimes generates verbose responses that exceed this limit.

**Question:** A developer needs to generate a code review summary that must not exceed 500 tokens. How should the model be configured to respect this constraint?

**Options:**

A. Trust the model completely to self-limit its own output length automatically

B. **[✓]** Configure the max tokens parameter and use stop sequences to respect the limit

C. Manually truncate the generated model output after it has been produced

D. Reduce the input size provided so the model naturally generates shorter output

**Correct Answer:** B

**Explanation:** Max tokens and output length management requires setting the max_tokens parameter to the desired limit. This tells the API to stop generating once the limit is reached. Additionally, consider using stop sequences to terminate generation at natural break points. Post-generation truncation should be a last resort as it may cut off mid-sentence.

**Source:** Exam Guide Ã‚Â§Task 4.8

---

### q108 — Task 4.9

**Scenario:** The model should generate only the code for a function, not the markdown code block closing or any subsequent explanation or commentary.

**Question:** An architect needs the model to generate code until it produces a complete function but stop before generating any explanatory text after the function. What mechanism supports this?

**Options:**

A. Tell the model just the code no explanation in the system prompt

B. **[✓]** Use stop sequences like code block markers that halt generation when encountered

C. Truncate the output manually after receiving the complete model response from the API

D. Set max tokens low so the model cannot generate extra text at all

**Correct Answer:** B

**Explanation:** Stop sequences are one or more strings that, when generated by the model, signal the API to stop producing further tokens. For code generation, using stop sequences like ``` or \n``` halts generation at the end of the code block. This is more precise than max_tokens truncation and ensures the output ends at a clean boundary.

**Source:** Exam Guide Ã‚Â§Task 4.9

---

### q109 — Task 4.10

**Scenario:** The user types code and the system should show completions in real-time, updating as the user continues typing.

**Question:** A real-time code completion feature needs to provide suggestions as the developer types. What API approach should be used for the best user experience?

**Options:**

A. Make a new complete API call for each keystroke event

B. Use batch processing to handle keystrokes together in groups

C. Pre-generate all possible completions for every character position

D. **[✓]** Use streaming responses to deliver tokens progressively as they generate

**Correct Answer:** D

**Explanation:** Streaming responses are the correct approach for real-time interactive experiences. Streaming delivers tokens incrementally as they are generated, allowing the UI to display partial results immediately. This provides a responsive user experience. Full-response waiting creates noticeable latency, and pre-generation is impractical for open-ended completions.

**Source:** Exam Guide Ã‚Â§Task 4.10

---

### q110 — Task 4.11

**Scenario:** The pipeline extracts structured data from documents. Downstream parsers expect strict JSON format with specific field names and types.

**Question:** A data extraction pipeline produces inconsistent output formats from the model despite detailed prompts. Some responses use JSON, others use YAML, and others use plain text. How should output format consistency be ensured?

**Options:**

A. Accept the format variation and write separate parsers for each format

B. **[✓]** Use multiple techniques together like schema tool use and few-shot examples for consistency

C. Only use the system prompt and hope the model complies this time

D. Post-process all the model output through an automated format converter tool

**Correct Answer:** B

**Explanation:** Response format consistency requires a multi-layered approach: (1) use tool_use with a strict JSON schema for programmatic enforcement, (2) provide few-shot examples showing the exact expected output, and (3) reinforce with system prompt instructions. No single technique is perfectly reliable, but the combination provides defense in depth.

**Source:** Exam Guide Ã‚Â§Task 4.11

---

### q111 — Task 4.12

**Scenario:** The team iterates on prompts for a customer support agent. They make changes based on intuition but cannot measure whether the changes actually improve outcomes.

**Question:** A team needs to systematically evaluate whether their prompt changes improve or degrade model performance. What methodology should they use?

**Options:**

A. Rely only on subjective developer judgment to evaluate prompt quality

B. **[✓]** Create a test dataset with expected outputs and measure accuracy and consistency

C. Use the latest prompt version in production and monitor for complaints

D. A/B test prompts in production without any structured measurement at all

**Correct Answer:** B

**Explanation:** Evaluation and testing of prompts requires a systematic methodology: (1) curate a test dataset representative of real inputs with expected outputs, (2) run prompt variants against this dataset, (3) measure metrics like accuracy, consistency, and format compliance, and (4) compare results statistically. This data-driven approach prevents subjective bias and ensures changes are genuinely improvements.

**Source:** Exam Guide Ã‚Â§Task 4.12

---

### q123 — Task 4.5

**Scenario:** The pipeline extracts invoice fields (invoice number, date, total amount, line items, vendor name) from scanned PDF invoices with varying layouts and quality.

**Question:** A team is designing a structured data extraction pipeline that processes invoices from PDF documents. Which techniques help ensure consistent, reliable output from the extraction agent? (Select all that apply.)

**Options:**

A. **[✓]** Use a JSON schema with tool_use to enforce the output structure and field types

B. Rely on a single system prompt instruction describing the expected output format

C. **[✓]** Make optional fields nullable in the schema to prevent fabrication of missing values

D. Set the prompt temperature to 1.0 to encourage maximum output variety

**Correct Answers:** A, C

**Explanation:** JSON schema enforcement via tool_use (option 0) guarantees the output structure matches downstream expectations. Nullable optional fields (option 2) prevent the model from fabricating values when information is absent from the source document. A single system prompt (option 1) is insufficient for reliable structured output. High temperature (option 3) reduces output consistency and increases hallucination risk.

**Source:** Exam Guide Ã‚Â§Task 4.5

---

### q125 — Task 4.6

**Scenario:** The agent reviews 50+ pull requests per week. Reviews should catch real issues without overwhelming developers with minor stylistic preferences or false positives.

**Question:** A team is implementing a PR review agent and wants to maximize the value of AI-generated code reviews. Which criteria should guide the review scope to produce focused, actionable feedback? (Select all that apply.)

**Options:**

A. **[✓]** Report all functional bugs and security vulnerabilities discovered in the changed code

B. Flag every formatting and naming style preference that differs from personal taste

C. **[✓]** Identify API compatibility breaks and performance regressions introduced by the changes

D. Comment on every line that could potentially be refactored or improved in any way

**Correct Answers:** A, C

**Explanation:** Effective PR reviews should focus on functional bugs and security issues (option 0) and API compatibility and performance regressions (option 2). These are high-value findings that directly impact code quality and system stability. Formatting preferences (option 1) should be enforced by automated linters, not reviewer comments. Flagging every potential refactoring (option 3) creates review fatigue and drowns out critical issues.

**Source:** Exam Guide Ã‚Â§Task 4.6

---

## D5: Context Management & Reliability (19 questions)

### q052 — Task 5.1

**Scenario:** The agent's context window quickly fills with database results, leaving little room for reasoning and analysis. The agent starts losing coherence after 3-4 queries.

**Question:** A 'query_database' tool returns 100KB of results per query, including audit fields, metadata, and full row data. The agent uses 5 queries per conversation. What is the primary concern with this approach?

**Options:**

A. The database tool is running too slowly for any practical usage

B. **[✓]** Tool results with excessive fields consume context tokens disproportionately for reasoning

C. The model cannot effectively parse large database query results at all

D. The API imposes a hard limit on tool calls per conversation window only

**Correct Answer:** B

**Explanation:** Tool results with excessive fields consume tokens disproportionately, crowding out space for model reasoning and conversation history. With 100KB of results per query, 5 queries consume 500KB of the context window, leaving very little room for analysis. This is a classic context management problem where tool output size must be controlled to preserve room for reasoning.

**Source:** Exam Guide Ã‚Â§Task 5.1

---

### q053 — Task 5.2

**Scenario:** The agent handles a multi-step payment workflow: validating the account, checking balance, processing payment, and sending confirmation. Each step is a separate tool call across multiple turns.

**Question:** A financial transactions agent processes payments across multiple conversation turns. How should critical transactional data that must persist across the entire session be managed?

**Options:**

A. Keep all transactional data in the conversation history for natural model reference

B. **[✓]** Use a persistent structured case facts block maintained throughout the session for critical data

C. Store data in a separate file on disk and re-read it during each turn

D. Resubmit the transactional data along with each and every single user message

**Correct Answer:** B

**Explanation:** A persistent structured case facts block ensures critical transactional data (customer ID, amount, account number, transaction status) is preserved accurately across turns. Conversation history can accumulate and change focus, but a structured facts block in the system prompt or as a dedicated context section maintains authoritative data that the model can always reference.

**Source:** Exam Guide Ã‚Â§Task 5.2

---

### q054 — Task 5.3

**Scenario:** The customer is frustrated and explicitly demands human intervention. The agent has a tool to escalate cases to a human team.

**Question:** A customer tells a support agent I want to speak to a manager after receiving an automated response about a refund policy. The refund request is straightforward and falls within the agent authority to resolve autonomously. The agent has an escalation tool available for transferring cases to human agents. How should the agent handle this explicit customer request for human assistance?

**Options:**

A. **[✓]** Honor the explicit customer demand for a human agent immediately by triggering the escalation workflow without further automated attempts

B. Explain that the automated system is fully capable of resolving this particular request and continue processing the refund autonomously

C. Acknowledge the customer frustration but offer to resolve the issue first escalating only if the customer reiterates the request

D. Offer a callback option for the customer to speak with a human at a later time while processing the refund automatically in the meantime

**Correct Answer:** A

**Explanation:** An explicit customer demand for a human is a mandatory escalation trigger. The agent must not negotiate, ignore, or override this request. The correct behavior is to immediately trigger the escalation process, provide a clear handoff summary, and gracefully transition the customer to a human agent. Respecting this boundary is both a design requirement and a regulatory consideration in many jurisdictions.

**Source:** Exam Guide Ã‚Â§Task 5.3

---

### q055 — Task 5.4

**Scenario:** The customer's request falls into a gap in the refund policy. The request seems reasonable, but no policy explicitly covers or prevents this scenario.

**Question:** A customer support agent encounters a situation where the refund policy does not cover the specific scenario the customer is requesting. The agent has the technical ability to issue a refund through its tools. What is the correct action?

**Options:**

A. Use personal judgment to make the best possible decision and issue the refund

B. **[✓]** Do not improvise and escalate to a human for policy exceptions and gaps

C. Create a brand new policy on the fly to handle this specific case

D. Deny the request automatically since no existing policy covers it at all

**Correct Answer:** B

**Explanation:** Policy exceptions and gaps require escalation, not improvisation. The agent must not create new policies or interpret reasonable-sounding requests as authorization. When there is no clear policy coverage, the correct action is to escalate to a human who has the authority to make exceptions or set new policy. Creating policies or improvising solutions outside defined boundaries is a serious design flaw leading to unpredictable behavior.

**Source:** Exam Guide Ã‚Â§Task 5.4

---

### q056 — Task 5.5

**Scenario:** The payment processor could fail due to: insufficient funds, network timeout, invalid account, or daily limit exceeded. Each requires a different recovery action.

**Question:** A multi-agent refund processing system has a coordinator that routes to specialist agents. When a refund request fails at the payment processor, the payment agent returns 'Error: Operation failed.' How does this impact the coordinator's ability to recover?

**Options:**

A. The coordinator can always retry the operation regardless of the error type

B. The coordinator should simply ignore errors and proceed with the next request

C. **[✓]** Generic error responses hide the context needed to determine the correct recovery strategy

D. The error message is sufficient for the coordinator to determine the next action

**Correct Answer:** C

**Explanation:** Generic error responses ('Operation failed') hide the specific error context that the coordinator needs for intelligent recovery. Without knowing whether the error was transient (network timeout - retryable), validation (invalid account - fix input), or business (limit exceeded - escalate), the coordinator cannot determine the correct recovery action. Structured error responses with categories and details are essential for effective error recovery.

**Source:** Exam Guide Ã‚Â§Task 5.5

---

### q057 — Task 5.6

**Scenario:** After 3 hours of intensive investigation with 50+ tool calls and message exchanges, the agent starts re-examining issues it already resolved and misses references to earlier conclusions.

**Question:** A long-running agent session has processed 50+ messages and the model is beginning to lose coherence, forget earlier findings, and repeat investigations already completed. What is the most effective mitigation?

**Options:**

A. Restart the session from scratch and lose all of the previously gathered context

B. Reduce the complexity of the investigation to better fit the context window

C. **[✓]** Use scratchpad files as external memory to persist findings and state throughout the session

D. Ask the user to repeat the information that the agent has already forgotten

**Correct Answer:** C

**Explanation:** Context degradation is a known challenge in long-running sessions. Scratchpad files serve as external memory that persists key findings, decisions, and state outside the conversation context. The agent can write structured summaries to scratchpad files periodically and read them back to refresh context. This is more reliable than relying on the conversation history which may be compressed or partly lost.

**Source:** Exam Guide Ã‚Â§Task 5.6

---

### q058 — Task 5.7

**Scenario:** The QA team reviews every single data transformation output. This is expensive and slow. They want to automate verification but cannot compromise on accuracy.

**Question:** A quality assurance pipeline uses an agent to validate data transformations. Currently, the pipeline performs 100% human review of all outputs. The team wants to reduce human effort while maintaining quality. What is the correct approach?

**Options:**

A. Immediately reduce human review to ten percent sampling since automation is reliable

B. Eliminate all human review entirely and trust the automated validation process

C. **[✓]** First validate accuracy at the segment level then reduce review after establishing metrics

D. Reduce review only for low priority data segments before moving to high priority

**Correct Answer:** C

**Explanation:** Before reducing review thresholds, you must first establish accuracy metrics through segment-level accuracy validation. Measure the agent's accuracy on different data segments, compare against human review, and only reduce review coverage after achieving confidence thresholds. Premature reduction without validation risks quality degradation that may go undetected.

**Source:** Exam Guide Ã‚Â§Task 5.7

---

### q059 — Task 5.8

**Scenario:** Three research agents investigated different aspects of a security incident. The synthesis agent creates a unified timeline but cannot attribute findings to specific source agents for verification.

**Question:** A synthesis agent combines findings from multiple research subagents into a final report. During synthesis, the agent loses track of which finding came from which source, making verification impossible. What pattern prevents this?

**Options:**

A. Have one agent do all the research to avoid multi-source synthesis problems

B. Include all raw source documents in the final report for the reader to cross-reference

C. Focus only on findings from the most reliable source agent for the report

D. **[✓]** Use claim-source mappings that explicitly track each finding back to its originating agent

**Correct Answer:** D

**Explanation:** Claim-source mappings prevent attribution loss during synthesis. Each finding should be explicitly tagged with its source (e.g., 'Analysis by Agent A found: ...'). This enables verification, provides traceability, and allows the reader (or downstream processes) to assess the reliability of each claim. Without source mappings, synthesized reports lose provenance information critical for trust and verification.

**Source:** Exam Guide Ã‚Â§Task 5.8

---

### q060 — Task 5.9

**Scenario:** The sources used different monitoring tools and measurement methodologies. Both findings may be valid for their specific context.

**Question:** A multi-agent research system produces a report where two subagents present conflicting data about the same metric from different monitoring tools and measurement periods. One source reports an average response time of two hundred milliseconds while another reports four hundred fifty milliseconds from a different tool. The synthesis agent must combine these findings into a coherent report. Which approach preserves accuracy and enables proper interpretation?

**Options:**

A. **[✓]** Annotate both conflicting values with explicit source attribution and methodological context for each separate measurement finding

B. Select the more conservative value and discard the alternative to present a single consistent finding in the final report

C. Compute the mathematical average of the two values to produce a compromise estimate between both available measurements

D. Flag the discrepancy as a data extraction error and request each subagent to redo its analysis using identical measurement methodology

**Correct Answer:** A

**Explanation:** When sources conflict, the correct approach is to annotate both with attribution rather than arbitrarily selecting one value or computing a misleading average. The synthesis should present: 'Agent A (using DataDog) reports 200ms average; Agent B (using CloudWatch) reports 450ms average. This discrepancy may be due to different measurement periods or tooling differences.' This preserves the nuance and allows the reader to understand the context of each claim.

**Source:** Exam Guide Ã‚Â§Task 5.9

---

### q112 — Task 5.10

**Scenario:** The application processes legal documents averaging 50K tokens each, plus tool results and conversation history. The total frequently approaches or exceeds the context limit.

**Question:** A developer is building an application that needs to stay within a 128K token context window. The agent regularly processes large documents and tool results. What strategy should be used to manage context window limits?

**Options:**

A. Ignore the limit and let the API truncate oldest content automatically

B. **[✓]** Estimate token counts prioritize critical information and prune to stay within limits

C. Always upgrade to the maximum available context window size available

D. Process everything in fixed token chunks regardless of document boundaries

**Correct Answer:** B

**Explanation:** Context window limits and management require proactive planning: (1) estimate token counts for documents, tool results, and conversation history, (2) prioritize critical information in a structured facts block, (3) summarize verbose content, and (4) prune low-value history. Blind truncation of oldest content may lose critical information that the model still needs.

**Source:** Exam Guide Ã‚Â§Task 5.10

---

### q113 — Task 5.11

**Scenario:** The application dynamically constructs prompts with variable-length inputs. Exceeding the context window causes truncation and degraded responses.

**Question:** An architect needs to estimate how many tokens a given text input will consume before making an API call. What is the best approach for token counting and estimation?

**Options:**

A. Count the total characters and divide by four as a rough approximation

B. **[✓]** Use a tokenizer library that matches the model tokenizer for accurate counting

C. Make the API call and check the usage field in the response post-hoc

D. Estimate based on number of words with one word equaling one point three tokens

**Correct Answer:** B

**Explanation:** Token counting and estimation should use a tokenizer library that matches the model's tokenizer (e.g., claude-tokenizer or Anthropic's token counting API). This provides accurate pre-call estimates, enabling proactive context management. Character-based heuristics or word-based estimates can be inaccurate, especially for code or structured data. Post-hoc checking is too late for prevention.

**Source:** Exam Guide Ã‚Â§Task 5.11

---

### q114 — Task 5.12

**Scenario:** The session has investigated three separate issues, each with its own findings, decisions, and action items. All three may need to be referenced again.

**Question:** A long-running agent session has accumulated 100+ messages covering multiple topics. The context window is nearly full. How should the conversation be summarized to preserve essential information?

**Options:**

A. Delete the oldest messages and keep only the most recent half

B. Ask the model to write a single paragraph summarizing the entire session

C. **[✓]** Generate topic-specific summaries for each thread preserving key findings and decisions

D. Save the full conversation to a file and start a completely fresh session

**Correct Answer:** C

**Explanation:** Conversation summarization strategies should produce topic-specific summaries rather than generic compression. Each thread of investigation should be condensed into its key findings, decisions, and action items. This preserves the structured knowledge while removing verbose tool outputs and redundant exchanges. Single generic summaries lose too much context, and simple deletion risks losing important information.

**Source:** Exam Guide Ã‚Â§Task 5.12

---

### q115 — Task 5.13

**Scenario:** The model processes 80K token documents. Facts from the first 10K and last 10K tokens are reliably extracted, but facts from the middle 60K tokens are frequently missed or incorrectly recalled.

**Question:** A QA team notices that when processing long documents, the model tends to accurately recall information from the beginning and end of the context window but misses details from the middle sections. What phenomenon is this?

**Options:**

A. This is a random sampling error that will average out over time

B. **[✓]** The lost in the middle effect describes models having reduced accuracy for mid-context content

C. This indicates the model is not capable of processing long documents effectively

D. This is caused by the input having too many distinct topics in the content

**Correct Answer:** B

**Explanation:** The 'lost in the middle' effect is a well-documented phenomenon where language models show reduced accuracy for information positioned in the middle of the context window, compared to information at the beginning (primacy effect) and end (recency effect). Mitigations include: placing critical information at the start or end, using structured formats, and performing targeted retrieval rather than relying on the model to scan the full context.

**Source:** Exam Guide Ã‚Â§Task 5.13

---

### q116 — Task 5.14

**Scenario:** The agent ran 15 database queries early in the session, each returning 20KB of results. The current task only needs to reference the conclusions drawn from those queries, not the raw data.

**Question:** A developer's agent session has accumulated large amounts of verbose tool output that is no longer needed for current reasoning. What context pruning technique should be used?

**Options:**

A. Keep all tool results in the conversation in case they are needed later

B. Increase the size of the context window to accommodate all data

C. Delete the oldest messages including tool outputs without any summarization at all

D. **[✓]** Prune verbose tool outputs after extracting key insights replacing them with concise summaries

**Correct Answer:** D

**Explanation:** Context pruning techniques should remove verbose raw data after it has served its purpose, replacing it with concise summaries of the conclusions drawn. This frees context window space while preserving the insights the model needs for ongoing reasoning. Simple deletion without summarization loses valuable conclusions, while retaining all raw data wastes precious context space.

**Source:** Exam Guide Ã‚Â§Task 5.14

---

### q117 — Task 5.15

**Scenario:** The system has 5 research agents producing analysis. A synthesis agent combines findings. Downstream consumers need to verify the source of each claim.

**Question:** A multi-agent research system must track where each piece of information came from to enable verification and auditing. What architectural pattern supports this?

**Options:**

A. Trust the synthesis agent implicitly to accurately represent all source information

B. **[✓]** Tag each finding with its source agent timestamp methodology and confidence level

C. Put raw research output in the final report for the reader to parse

D. Have the coordinator review all findings for accuracy before passing them on

**Correct Answer:** B

**Explanation:** Information provenance and source tracking requires each finding to be tagged with metadata throughout the pipeline: originating agent, timestamp, methodology used, and confidence level. This enables downstream consumers to verify claims, assess reliability, and trace information back to its origin. Without provenance metadata, synthesized information loses its audit trail and cannot be effectively verified.

**Source:** Exam Guide Ã‚Â§Task 5.15

---

### q118 — Task 5.16

**Scenario:** The system processes thousands of tickets daily. Failures, timeouts, and unexpected inputs are common. The system must handle these gracefully without data loss or inconsistent state.

**Question:** A production system uses an AI agent to process customer support tickets. What patterns should be implemented to ensure reliable operation in production?

**Options:**

A. Assume the model and tools will work correctly most of the time

B. Process all tickets through a sequential workflow to reduce complexity

C. Monitor the system manually and restart it when failures occur

D. **[✓]** Implement retry with backoff circuit breakers and dead-letter queues for reliability

**Correct Answer:** D

**Explanation:** Reliability patterns for production systems include: (1) retry with backoff for transient failures, (2) idempotent operations to safely retry without side effects, (3) circuit breakers to stop hammering failing services, (4) dead-letter queues for items that cannot be processed, and (5) comprehensive logging for debugging. Production AI systems need the same reliability infrastructure as traditional production services.

**Source:** Exam Guide Ã‚Â§Task 5.16

---

### q119 — Task 5.17

**Scenario:** The API experiences occasional outages lasting 5-30 minutes. Orders must still be accepted and queued for processing, even if AI analysis is temporarily unavailable.

**Question:** A critical AI-powered order processing system needs to handle the case where the underlying LLM API is unavailable. What fallback and degradation strategy is most appropriate?

**Options:**

A. Reject all incoming orders during outages and ask customers to try later

B. Switch over to a fully manual process during every outage period

C. **[✓]** Queue orders during outages with pending review and process when the API recovers

D. Completely ignore the API outages and continue attempting API calls indefinitely

**Correct Answer:** C

**Explanation:** Fallback and degradation strategies should maintain system availability: (1) queue requests during outages with clear status tracking, (2) process queued items when service recovers, (3) notify customers of potential delays, (4) optionally use a simpler fallback model if available. This ensures the system remains functional even when the primary AI service is unavailable, maintaining business continuity.

**Source:** Exam Guide Ã‚Â§Task 5.17

---

### q120 — Task 5.18

**Scenario:** Loan applications over $50,000 must be reviewed and approved by a human underwriter before the loan can be finalized. The AI handles all applications up to $50,000 autonomously.

**Question:** A financial services company uses an AI agent to process loan applications. Certain high-value applications require mandatory human approval before finalization. What workflow pattern supports this?

**Options:**

A. Let the AI process all applications and have humans audit them afterward

B. Trust the AI to decide when human review is needed based on judgment

C. Require human review of every single application regardless of the amount

D. **[✓]** Use a human-in-the-loop workflow routing high-value loan applications to the reviewers

**Correct Answer:** D

**Explanation:** Human-in-the-loop review workflows implement a threshold-based escalation: below the threshold ($50K), the AI processes autonomously with appropriate speed and efficiency. At or above the threshold, the AI prepares a comprehensive analysis package and routes it to a human for final decision. This balances efficiency for routine cases with appropriate oversight for high-risk decisions. Leaving the escalation decision to the AI's judgment is unreliable for regulatory compliance.

**Source:** Exam Guide Ã‚Â§Task 5.18

---

### q124 — Task 5.19

**Scenario:** The application processes customer support requests using Claude API. The API occasionally returns 429 (rate limit) and 503 (service unavailable) errors lasting 10-60 seconds.

**Question:** An AI-powered application handles customer-facing interactions and experiences occasional API failures. Which patterns are appropriate for maintaining system reliability during transient failures? (Select all that apply.)

**Options:**

A. **[✓]** Implement exponential backoff retry logic for transient error responses

B. Show customers a generic timeout message and discard the failed request entirely

C. **[✓]** Use circuit breaker patterns to stop calling a failing endpoint and allow recovery time

D. Immediately escalate every single API error to a human operator for resolution

**Correct Answers:** A, C

**Explanation:** Exponential backoff retry (option 0) is the standard pattern for transient errors, starting with short delays and increasing between attempts. Circuit breakers (option 2) prevent cascading failures by stopping calls to a failing endpoint, allowing it time to recover, then gradually resuming traffic. Discarding requests (option 1) causes data loss. Escalating every error (option 3) is impractical and floods operators with non-critical alerts.

**Source:** Exam Guide Ã‚Â§Task 5.19

---

