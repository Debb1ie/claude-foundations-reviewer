# CCA-F Question Bank
> Claude Certified Architect — Foundations Exam
> Exported on 2026-07-16
> Total Questions: 125

---

## D1: Agentic Architecture & Orchestration (33 questions)

### q001 — Task 1.1

**Scenario:** The agent checks stop_reason after each API response and appends tool results between iterations. Analysis shows inconsistent loop termination behavior.

**Question:** A team builds a customer support agent that processes multi-step refund requests by calling verification tools, refund tools, and notification tools in sequence. During testing, the agent occasionally terminates its loop after a single verification call and presents a final response before the refund is processed. Which design change would most directly resolve this reliability issue?

**Options:**

A. Pre-configure a fixed sequential tool chain so verification, refund, and notification always execute unconditionally in a deterministic order

B. Parse assistant message text for completion keywords like resolved or finished to infer when the workflow has reached its terminal state

C. **[✓]** Check stop_reason after each API response, continue looping on tool_use, terminate on end_turn, and append each tool result in the user turn

D. Enforce a minimum of three agentic iterations before allowing a final response, resetting the counter on any end_turn signal received

**Correct Answer:** C

**Explanation:** The correct approach is to check the stop_reason field in the API response. When stop_reason is end_turn, the model has finished and is not requesting any tool calls. When it is tool_use, the model is requesting to call a tool and the loop should continue. Fixed iteration counts or content length heuristics are brittle and do not reflect the model's actual state.

**Source:** Exam Guide §Task 1.1

---

### q002 — Task 1.2

**Scenario:** A code review agent calls a static analysis tool and receives findings. You need to structure the next API request so the model can reason about the results.

**Question:** In an agentic workflow, a tool returns results that need to be fed back to the model. What is the correct way to provide tool results back to the model in the conversation history?

**Options:**

A. **[✓]** Append the tool result as a tool_result content block within the user turn following the assistant message that issued the tool_use block

B. Attach the tool result as a metadata field on the original tool_use block so the model can reference it in place during processing

C. Append the tool result as a new user message with a tool_result prefix to clearly label it in the conversation history for the model

D. Inject the tool result into the existing system message so the model treats it as persistent context available for all subsequent turns

**Correct Answer:** A

**Explanation:** Tool results must be appended as a tool_result content block within the user turn that follows the assistant message that issued the tool_use. This maintains the correct turn structure and allows the model to correlate the result with the specific tool call via its tool_use_id. Labeling it as an ad-hoc text-prefixed message instead of a proper tool_result block (as in the other options) breaks this structure and can confuse the model's understanding of who said what.

**Source:** Exam Guide §Task 1.2

---

### q003 — Task 1.3

**Scenario:** You are designing a market research system where three specialists (competitor analysis, customer sentiment, pricing trends) can operate independently.

**Question:** A coordinator agent needs to execute three independent research tasks in parallel using subagents. What is the correct architectural approach?

**Options:**

A. **[✓]** Issue multiple Task tool calls within a single coordinator response so each research concern runs as a concurrent independent subagent

B. Route all three research concerns to a single multifunctional subagent that handles each domain in sequence within one extended session

C. Spawn a dedicated supervisor subagent whose sole responsibility is coordinating the three domain-specific research subagents below it

D. Execute all three research tasks sequentially inside a single agentic loop to preserve shared context coherence across the entire investigation

**Correct Answer:** A

**Explanation:** Parallel subagent execution is achieved by issuing multiple Task tool calls in a single coordinator response. Each Task invocation spawns an independent subagent that runs concurrently. This is far more efficient than sequential execution when tasks have no dependencies. The coordinator should then collect and synthesize results after all parallel tasks complete.

**Source:** Exam Guide §Task 1.3

---

### q004 — Task 1.4

**Scenario:** Analysis of the system shows that 40% of support requests are about technical issues, 35% about account management, and 25% about billing. The triage agent processes all requests through the billing agent as a mandatory first step.

**Question:** A development team builds a customer support agent system with a triage agent, a billing agent, and an escalation agent. The triage agent always routes every request through the billing agent first before checking other specialists. What is the primary anti-pattern here?

**Options:**

A. The system uses too many specialist agents for the volume of requests, creating coordination overhead that exceeds the efficiency benefit

B. A single generalist agent should handle both triage and resolution to eliminate the overhead introduced by the multi-agent architecture

C. **[✓]** Routing all requests through the billing agent first before other specialists adds unnecessary latency and consumes tokens for irrelevant tasks

D. Unconditional sequential routing through all specialists regardless of request type adds latency and wastes tokens on irrelevant processing

**Correct Answer:** C

**Explanation:** The anti-pattern is unconditionally routing every request through the billing agent first, regardless of what the request is actually about. A coordinator should use classification to direct requests only to relevant agents. Forcing every request through the billing agent as a mandatory first step creates unnecessary latency, token consumption, and potential error surface area for the 75% of requests that have nothing to do with billing. The correct approach is intent-based routing where the coordinator classifies the request and dispatches only to relevant agents.

**Source:** Exam Guide §Task 1.4

---

### q005 — Task 1.5

**Scenario:** Research agents each produce analysis documents. The synthesis agent needs to combine these findings into a unified report.

**Question:** A multi-agent system has a research coordinator, a findings synthesis agent, and a report generator. How should the synthesis agent access findings from the research agents?

**Options:**

A. **[✓]** Have the coordinator explicitly pass relevant research findings to the synthesis agent as part of the task specification or input parameters

B. Provision a shared read-write state store that all agents can access freely to read and update findings throughout the workflow execution

C. Allow the synthesis agent to issue callback requests to research agents on demand whenever it needs clarification on specific data points

D. Grant the synthesis agent direct read access to the full conversation history of each research agent so it can trace findings back to source

**Correct Answer:** A

**Explanation:** Context isolation between subagents is critical. The coordinator should explicitly pass relevant findings to the synthesis agent via the task description or tool call parameters. This maintains clean separation of concerns, prevents context pollution, and ensures each agent receives only the information it needs. Direct access to other agents' histories or shared mutable state creates coupling and can lead to context degradation.

**Source:** Exam Guide §Task 1.5

---

### q006 — Task 1.6

**Scenario:** The coordinator correctly identifies when subagent help is needed and issues task requests, but the subagents never execute and the coordinator receives no results.

**Question:** A coordinator agent is designed to spawn subagents for specialized analysis tasks. The coordinator is not producing the expected results when it tries to delegate. What is the most likely configuration issue?

**Options:**

A. The organization's API subscription tier does not include permissions required for multi-agent orchestration workflow execution

B. Subagents must be pre-registered and declared in a manifest configuration file before the coordinator can successfully delegate to them

C. Each subagent's system prompt lacks sufficiently detailed instructions about its domain responsibilities and expected output format

D. **[✓]** The Task tool is absent from the coordinator's allowed tools list, so its delegation requests are silently rejected without spawning agents

**Correct Answer:** D

**Explanation:** For a coordinator to spawn subagents using the Task tool, that tool must be explicitly listed in the coordinator's allowedTools configuration. Without this, the coordinator's request to delegate is silently ignored or rejected. This is a common misconfiguration. The solution is to ensure the coordinator's tool configuration includes the Task tool.

**Source:** Exam Guide §Task 1.6

---

### q007 — Task 1.7

**Scenario:** The agent must handle PCI-sensitive operations. Before any financial transaction is executed, the system must verify compliance requirements are met.

**Question:** A financial services company uses a customer support agent with a process_refund tool that can issue payments. Management requires verified customer identification before any refund can be executed. Logs show the agent occasionally skips the get_customer tool and calls process_refund using only a stated name, causing incorrect refunds to be issued. Which approach provides the most reliable enforcement of this business rule?

**Options:**

A. Provide multi-turn few-shot examples in the prompt that consistently demonstrate get_customer being called before process_refund each time

B. Configure an intent-classification router that analyzes each incoming request and enables only the subset of tools appropriate for that category

C. Add a detailed system prompt instruction explicitly requiring that customer identity verification must precede every refund tool invocation

D. **[✓]** Implement a programmatic PreToolUse gate that intercepts process_refund calls and blocks execution until get_customer has returned a verified ID

**Correct Answer:** D

**Explanation:** A programmatic prerequisite gate (via a PreToolUse hook or validation layer) that checks compliance conditions before allowing financial operations is essential for PCI compliance. Relying solely on model instructions is insufficient for regulatory requirements. The gate should verify conditions like identity verification, amount limits, and audit logging requirements before allowing any financial tool execution.

**Source:** Exam Guide §Task 1.7

---

### q008 — Task 1.8

**Scenario:** After multiple interactions, the billing agent determines the case requires senior team involvement due to a policy exception.

**Question:** A customer support agent needs to hand off a complex case from the billing specialist to the senior escalation team. What information must the handoff summary include?

**Options:**

A. **[✓]** Provide customer identity, root cause analysis, actions already taken, and all commitments made to the customer during prior interactions

B. Include only the case identifier and the primary escalation reason so the senior team can quickly triage without being overwhelmed by details

C. Summarize the customer name and the disputed financial amount as the minimum information required to initiate senior team review

D. Transfer the complete unprocessed conversation transcript so the senior team has access to every statement made during the interaction

**Correct Answer:** A

**Explanation:** A proper handoff summary must include: customer details (identity, account info), root cause (what led to the issue), actions taken (what has already been attempted or resolved), and commitments made (any promises or expectations set with the customer). This ensures the receiving team has full context without needing to re-read raw conversation logs, enabling efficient case continuation.

**Source:** Exam Guide §Task 1.8

---

### q009 — Task 1.9

**Scenario:** Different subagents return timestamps in different formats: one uses ISO 8601, another uses Unix epoch, and a third uses human-readable dates.

**Question:** A multi-agent scheduling system uses various date/time formats from subagents. How should you ensure consistent timestamp formatting across all agents?

**Options:**

A. **[✓]** Implement a PostToolUse hook that intercepts all tool results and normalizes timestamps to the standard format before they reach the model

B. Accept heterogeneous timestamp formats throughout the pipeline and perform a single normalization pass only at the final presentation layer

C. Instruct the coordinator agent to detect and reformat inconsistent timestamps in natural language before passing data to downstream agents

D. Document the required ISO 8601 timestamp format in the project README and rely on developers to enforce it when building new subagent tools

**Correct Answer:** A

**Explanation:** A PostToolUse hook is the correct mechanism for transforming tool results after execution. By normalizing timestamps in this hook, you ensure consistent formatting before results reach the model or downstream agents. This keeps formatting logic centralized and maintainable, rather than relying on individual agents to comply or performing ad-hoc conversions.

**Source:** Exam Guide §Task 1.9

---

### q010 — Task 1.10

**Scenario:** The agent currently calls a process_refund tool directly when the model decides to issue a refund. You need to add the approval gate without modifying the tool itself.

**Question:** A refund processing agent uses a process_refund tool that can issue customer payments. Management mandates that any refund exceeding five hundred dollars must receive manager approval before execution. The current implementation relies on a system prompt instruction asking the agent to seek approval, but logs show refunds over the threshold are occasionally processed without authorization. Which mechanism should replace this prompt-based approach?

**Options:**

A. Create a manager_approval tool that the model must explicitly invoke before calling process_refund whenever the requested amount is large

B. Modify the process_refund tool to cap its accepted amount parameter and require a separate elevated-permission tool for higher-value refunds

C. **[✓]** Implement a PreToolUse hook that inspects refund amount parameters, blocks calls exceeding five hundred dollars, and routes them for approval

D. Add a PostToolUse audit step that flags unauthorized refunds after execution and queues them for manual review by a compliance officer

**Correct Answer:** C

**Explanation:** A PreToolUse hook is the correct interception mechanism. It runs before the tool executes, can inspect the tool parameters (like refund amount), and can block the call, redirect to an approval flow, or log the attempt. This provides a programmatic guard that cannot be bypassed by the model, unlike prompt instructions which the model might ignore or misinterpret.

**Source:** Exam Guide §Task 1.10

---

### q011 — Task 1.11

**Scenario:** A user submits a high-level investigation request without specifying particular metrics, time ranges, or systems to examine.

**Question:** When an agent receives a vague or open-ended request like 'investigate the performance issues,' how should the agent structure its approach?

**Options:**

A. **[✓]** Use dynamic decomposition to autonomously break the vague request into discrete, actionable sub-tasks with defined scope and success criteria

B. Launch a broad parallel scan across all available performance metrics simultaneously to maximize the coverage of the initial analysis phase

C. Pause all investigation activity and ask the user to specify concrete metrics, time ranges, and system boundaries before any tool is called

D. Request that the user submit a structured investigation brief that specifies target systems, relevant metrics, and acceptable remediation options

**Correct Answer:** A

**Explanation:** Dynamic decomposition is the correct pattern for open-ended investigation tasks. The agent should autonomously break down the vague request into concrete, actionable sub-tasks (e.g., 'check CPU usage', 'analyze query latency', 'review error rates'). This demonstrates proactive architectural judgment rather than requiring human clarification at every step. The decomposition should be explicit in the agent's reasoning so the user can see and validate the plan.

**Source:** Exam Guide §Task 1.11

---

### q012 — Task 1.12

**Scenario:** The review spans 200+ files across multiple packages. The agent must assess code quality, security issues, and adherence to project conventions.

**Question:** An architect is designing a large-scale code review agent that must analyze hundreds of files. What is the optimal architectural pattern for file analysis in this context?

**Options:**

A. Load all two hundred or more files into one large context window simultaneously so the model can reason about the codebase holistically

B. Restrict the review only to files most recently modified by the triggering commit to focus effort on the highest-risk changed surface area

C. Analyze files in the order they are discovered in the directory tree and aggregate all findings without a structured cross-file integration pass

D. **[✓]** Apply per-file local analysis for individual-file issues and then conduct a separate cross-file pass to identify system-level patterns and gaps

**Correct Answer:** D

**Explanation:** The correct pattern is per-file local analysis (examining each file individually for issues) followed by cross-file integration (identifying patterns, inconsistencies, and architectural concerns across files). This two-pass approach avoids context window overflow while still capturing system-level issues. Single-pass approaches lose cross-file context, and random sampling risks missing critical issues.

**Source:** Exam Guide §Task 1.12

---

### q013 — Task 1.13

**Scenario:** The developer was in the middle of a complex refactoring session and realized a configuration file needs updating. After saving the file externally, they want to continue the session.

**Question:** A developer makes changes to a configuration file while a Claude Code session is running. How should the developer resume work with the updated configuration?

**Options:**

A. Rely on the running session to automatically detect external file modifications and reload the changed configuration without explicit prompting

B. **[✓]** Use the resume flag to restore the previous session context and then explicitly inform the agent that the configuration file was modified

C. Start a completely fresh session and manually re-enter all prior context so the agent begins with an accurate picture of the current state

D. Append a description of the configuration changes as a new user message within the existing session so the agent is aware of the update

**Correct Answer:** B

**Explanation:** Using --resume restores the previous session context, but the developer should explicitly inform the agent that the configuration file has changed. The agent can then re-read the file and adapt its understanding. Automatic detection of external file changes is not guaranteed, and starting a new session loses all progress. Explicit communication about changes is essential.

**Source:** Exam Guide §Task 1.13

---

### q014 — Task 1.14

**Scenario:** The team has a working codebase but wants to evaluate two different architectural approaches: one using a microservices pattern and another using modular monolith.

**Question:** An architect has a stable baseline implementation and wants to explore two alternative refactoring approaches without losing the original work. What is the recommended approach?

**Options:**

A. **[✓]** Use fork_session to create independent session branches from the shared baseline so both approaches can diverge without affecting each other

B. Edit the original shared codebase directly and rely on standard git branching to track differences between each architectural approach explored

C. Ask the agent to describe both architectural approaches in detail and defer any actual implementation until one approach is selected and approved

D. Manually recreate both architectural alternatives from scratch in separate project directories before running a structured side-by-side comparison

**Correct Answer:** A

**Explanation:** fork_session is designed for exploring divergent approaches from the same baseline. It creates independent session branches that share the initial context but can diverge in different directions. This is ideal for architectural exploration where you want to compare multiple approaches without affecting the original session or losing the baseline context. Git branches alone do not capture the conversational context.

**Source:** Exam Guide §Task 1.14

---

### q015 — Task 1.15

**Scenario:** The request touches frontend, backend, and infrastructure concerns simultaneously.

**Question:** A user submits a single request that contains multiple distinct concerns: 'Update the login page styling, add rate limiting to the API, and fix the database connection pool leaks.' How should the agent handle this?

**Options:**

A. **[✓]** Decompose the request into parallel investigations per concern, allowing each to run independently, then synthesize results into a unified plan

B. Merge all three concerns into a single unified implementation attempt to reduce coordination overhead and minimize total changes needed

C. Address all three concerns sequentially in a single uninterrupted session to preserve end-to-end context coherence across all changes made

D. Respond to only the first concern identified in the request and ask the user to submit the remaining concerns as separate follow-up requests

**Correct Answer:** A

**Explanation:** Multi-concern requests should be decomposed into parallel investigations. Each concern (styling, rate limiting, connection pooling) can be investigated independently by separate subagents or focused analysis passes. After parallel investigation, the coordinator synthesizes findings into a unified implementation plan. This is far more efficient than sequential processing and reduces total time.

**Source:** Exam Guide §Task 1.15

---

### q016 — Task 1.16

**Scenario:** The initial discovery identified 15 potential vulnerabilities. The agent now needs to deeply investigate the critical ones. The user needs visibility into what was found before approving the deep dive.

**Question:** A security audit agent has completed its initial discovery phase and needs to transition into a deep-dive investigation. What architectural pattern supports this transition effectively?

**Options:**

A. Proceed directly into the full deep-dive investigation on all fifteen identified vulnerabilities to maximize coverage and minimize elapsed time

B. Return to the user for explicit individual sign-off on each of the fifteen discovered vulnerabilities before investigating any of them further

C. Randomly select a representative sample of the discovered items for deep investigation to stay within acceptable time and token constraints

D. **[✓]** Present a structured discovery summary and a proposed prioritized deep-dive plan, then await user review and approval before proceeding further

**Correct Answer:** D

**Explanation:** Phase transition summarization is the correct pattern. Between major phases (discovery to deep-dive), the agent should produce a structured summary of findings and a clear plan for the next phase. This provides a checkpoint for the user to review, approve, or redirect before significant additional work begins. It balances autonomy with appropriate human oversight.

**Source:** Exam Guide §Task 1.16

---

### q061 — Task 1.17

**Scenario:** The system has 5 specialist agents handling different domains. The coordinator receives all user requests and delegates accordingly.

**Question:** A team is designing a multi-agent system where a coordinator delegates tasks to subagents. What is the primary benefit of using a hub-and-spoke architecture where all communication flows through a central coordinator?

**Options:**

A. **[✓]** It provides a single control point for routing, centralized context synthesis, and prevents uncoordinated agent-to-agent communication patterns

B. It minimizes the total number of API calls required to complete a task by consolidating multiple subagent interactions into fewer round trips

C. It eliminates the need to define separate tool schemas for individual subagents because the coordinator handles all tool resolution centrally

D. It allows subagents to communicate directly with each other for faster peer-to-peer information exchange without routing through the coordinator

**Correct Answer:** A

**Explanation:** A hub-and-spoke architecture with a central coordinator provides controlled routing, centralized context management, and organized result synthesis. The key benefit is preventing unconstrained agent-to-agent communication, which can lead to context pollution, runaway conversations, and unpredictable behavior. The coordinator acts as a controlled gateway and synthesis point.

**Source:** Exam Guide §Task 1.17

---

### q062 — Task 1.18

**Scenario:** Every tool call across all agents in the system must be logged with its parameters before execution. Failed validations should block the call.

**Question:** A developer wants to intercept every tool call before execution to log parameters for audit purposes and validate inputs against security rules. What mechanism should be used?

**Options:**

A. Embed custom logging and validation code directly inside each individual tool implementation to capture parameters at the point of execution

B. Create a dedicated internal audit tool that the model calls voluntarily at the start of each turn to self-report its planned tool invocations

C. Deploy a reverse proxy layer between the API gateway and the agent runtime to intercept and inspect all outbound tool request payloads

D. **[✓]** Implement a PreToolUse hook that runs before every tool execution, enabling centralized logging, input validation, and conditional blocking

**Correct Answer:** D

**Explanation:** A PreToolUse hook is the centralized mechanism for intercepting tool calls before execution. It runs automatically on every tool invocation, can log parameters, perform validation, and block or modify the call if needed. This provides a consistent audit trail without modifying individual tools and cannot be bypassed by the model.

**Source:** Exam Guide §Task 1.18

---

### q063 — Task 1.19

**Scenario:** A user submits a request to 'design a complete authentication system including login, registration, password reset, and OAuth integration'.

**Question:** An architect is designing a system where a coordinator decomposes a complex user request into smaller tasks and delegates them to subagents. What is the correct sequence of operations for task decomposition?

**Options:**

A. Delegate the decomposition responsibility to each subagent individually so they can define their own subtask scope without coordinator input

B. **[✓]** Analyze the complex request, decompose it into well-specified subtasks, assign each to the appropriate subagent, then synthesize all results

C. Perform the entire complex task within the coordinator itself without spawning subagents to eliminate the coordination overhead introduced

D. Spawn all subtasks simultaneously in parallel without upfront decomposition and then aggregate whatever results are returned by each subagent

**Correct Answer:** B

**Explanation:** Task decomposition follows a structured sequence: (1) analyze the complex request to understand its components, (2) decompose into well-defined, independent subtasks with clear specifications and acceptance criteria, (3) assign each subtask to the appropriate subagent via the Task tool, and (4) synthesize individual results into a coherent final output. This pattern maximizes parallelism while maintaining quality control.

**Source:** Exam Guide §Task 1.19

---

### q064 — Task 1.20

**Scenario:** An investigation involves collecting logs, analyzing patterns, cross-referencing with deployment history, and producing a report. The work spans multiple CLI sessions.

**Question:** A development team is building an agent that participates in long-running investigations spanning multiple hours. They need to save progress and restore it across CLI sessions. What session management approach is correct?

**Options:**

A. Rely on the model's inherent conversational memory to retain all context across separate CLI process invocations automatically between sessions

B. **[✓]** Use named sessions that persist conversation state and allow the investigation to be resumed across separate CLI restarts without context loss

C. Write a shell script that re-executes all previous commands from scratch at each session start to reproduce the investigation context

D. Capture screenshots of terminal output after each work session and manually re-enter the key context at the start of each new session

**Correct Answer:** B

**Explanation:** Named sessions provide the ability to save conversation state and resume across CLI sessions. This is essential for long-running investigations where the work naturally spans multiple sessions. Named sessions persist the entire conversation context, including tool results and the model's reasoning state, enabling interruption-free resumption.

**Source:** Exam Guide §Task 1.20

---

### q065 — Task 1.21

**Scenario:** The security scanner subagent crashes due to a malformed input file. The coordinator needs to continue processing other subagents and handle the failed one appropriately.

**Question:** A multi-agent system must gracefully handle errors in subagents. A security scanning subagent encounters an unhandled exception. What is the appropriate error handling pattern?

**Options:**

A. Halt the entire multi-agent system when any subagent fails to ensure that no investigation proceeds on the basis of incomplete information

B. Restart any failed subagent indefinitely in an automated retry loop until it produces a successful result or the overall session times out

C. **[✓]** Catch subagent failures gracefully, log the error with full context, continue processing unaffected subagents, and surface the failure clearly

D. Silently discard subagent failures and proceed with synthesis using only the partial results returned by the subagents that completed successfully

**Correct Answer:** C

**Explanation:** The correct error handling pattern is to catch subagent failures gracefully: log the error with full context, allow other independent subagents to continue processing, and report the failure to the user with sufficient context for resolution. This avoids both the extreme of crashing the entire system and the opposite extreme of silently ignoring failures.

**Source:** Exam Guide §Task 1.21

---

### q066 — Task 1.22

**Scenario:** An agent sometimes enters a loop of unnecessary tool calls, consuming tokens without making progress. The team wants to limit this behavior.

**Question:** A team is configuring the agent SDK for a multi-agent system. They need to set the maximum number of consecutive tool calls an agent can make before being forced to respond. What configuration controls this?

**Options:**

A. Reduce the number of tools available to the agent so there are fewer callable options and thus fewer opportunities for loop behavior to occur

B. **[✓]** Configure max_tool_rounds in the agent SDK to set a hard programmatic cap on consecutive tool calls before a response must be generated

C. Add a system prompt instruction asking the agent to self-limit its tool usage and avoid making more than a reasonable number of calls

D. Set a low token limit on the agent to force it to produce a final response sooner and reduce the window for excessive tool call accumulation

**Correct Answer:** B

**Explanation:** The agent SDK configuration includes settings like max_tool_rounds or max_consecutive_tool_calls that set a hard limit on how many sequential tool calls an agent can make without producing a text response. This is a safety guard against runaway tool usage and token waste. It is enforced programmatically, unlike prompt instructions which are advisory.

**Source:** Exam Guide §Task 1.22

---

### q067 — Task 1.23

**Scenario:** The application is a customer support agent handling a complex multi-issue case. The conversation spans many turns with various tool calls and results.

**Question:** An AI-powered application has a conversation history that has grown to 150 messages. The context window is approaching its limit and the model's responses are becoming less coherent. How should conversation history be managed?

**Options:**

A. Discard the oldest messages from the conversation history when nearing the context window limit to make room for new turns and tool results

B. Request a larger context window tier from the API provider to accommodate the full conversation history without requiring any content reduction

C. **[✓]** Summarize aging turns, prune verbose tool results that have served their purpose, and maintain a structured facts block for critical information

D. Terminate the current session proactively when the context window fills and initiate a new session for the customer to restart the interaction

**Correct Answer:** C

**Explanation:** Conversation history management requires a thoughtful strategy: (1) summarize older turns that are no longer immediately relevant, (2) prune verbose tool results that have served their purpose, (3) maintain a structured facts block for critical information that must persist, and (4) use sliding window approaches where appropriate. Simple deletion of oldest messages risks losing important context.

**Source:** Exam Guide §Task 1.23

---

### q068 — Task 1.24

**Scenario:** The triage agent identifies that the customer's problem has both a technical component (service outage) and a billing component (incorrect charges during the outage).

**Question:** A multi-agent system needs to transfer context from a triage agent to a billing specialist when a customer's issue involves both technical and billing concerns. What is the correct handoff pattern?

**Options:**

A. Terminate the current session and create a completely new session for the billing specialist with no reference to the prior triage interaction

B. **[✓]** Execute a structured handoff where the triage agent passes a comprehensive contextual summary to the billing specialist before disengaging

C. Allow both agents to proceed independently in parallel sessions and present their separate findings directly to the customer simultaneously

D. Ask the customer to re-explain their complete issue to the billing specialist so the specialist receives information directly from the source

**Correct Answer:** B

**Explanation:** The correct pattern is a structured agent handoff where the triage agent passes a comprehensive summary to the billing specialist. This summary should include: findings from the technical investigation, customer details, actions already taken, commitments made, and the specific billing issue that needs resolution. This ensures continuity without requiring the customer to repeat information or losing context.

**Source:** Exam Guide §Task 1.24

---

### q069 — Task 1.25

**Scenario:** The agent was processing a refund: it validated the customer, checked the transaction history, and was about to process the refund when the system restarted.

**Question:** An agent's session is interrupted by a system restart. The agent was in the middle of a multi-step transaction. How should state persistence be handled to enable safe resumption?

**Options:**

A. **[✓]** Persist the transaction state to external storage after each step so that a resumed session can restore context and continue safely from the checkpoint

B. Accept the state loss as an inherent limitation of the interruption and ask the customer to restart the multi-step transaction from the beginning

C. Persist only the final completion status of each step and discard intermediate collected data to minimize the storage footprint required

D. Resume the session after restart and allow the model to reconstruct the prior state naturally by re-running through the same workflow steps

**Correct Answer:** A

**Explanation:** State persistence involves saving the current transaction state to external storage so it can be restored after interruption. This includes: which steps have been completed, what data was collected, and what the next action should be. Upon resumption, this state is loaded and provided to the model. For multi-step transactions, especially those involving financial operations, losing state is unacceptable.

**Source:** Exam Guide §Task 1.25

---

### q070 — Task 1.26

**Scenario:** The system consists of a coordinator and 10 specialist agents running in production. The team needs to understand why certain decisions were made and diagnose failures.

**Question:** An architect needs to add observability to a multi-agent system to monitor agent decisions, tool usage patterns, and error rates. What is the most appropriate approach?

**Options:**

A. Configure each agent to generate a structured narrative summary report after every interaction turn describing its decisions and tool choices

B. **[✓]** Implement structured logging at the agent SDK level to capture decisions, tool usage, error context, and timing centrally across all agents

C. Insert console.log statements at key execution points within each individual tool implementation across all agents in the distributed system

D. Monitor only top-level API response time percentiles and HTTP error rate aggregates as proxy signals for overall system health and reliability

**Correct Answer:** B

**Explanation:** Agent observability should be implemented at the agent SDK or framework level, providing centralized structured logging of: agent decisions (what the model chose and why), tool usage patterns (which tools, how often, success/failure), error rates, and timing information. This is far more maintainable than adding logging to individual tools and provides consistent, searchable output for debugging and analysis.

**Source:** Exam Guide §Task 1.26

---

### q071 — Task 1.27

**Scenario:** The workflow involves: (A) analyze API spec, (B) generate client library, (C) write integration tests. Step B depends on A's output, and step C depends on B's output.

**Question:** An architect is evaluating whether to run subagents in parallel or sequentially for a given workflow. What factor most strongly suggests that sequential execution is required?

**Options:**

A. **[✓]** Sequential execution is required when the workflow contains dependency chains where a downstream subagent needs a prior subagent's output as input

B. Parallel execution always produces better throughput regardless of how tasks relate to each other and should always be the default choice

C. The total count of subagents in the workflow exceeds three, which typically indicates a need for sequential coordination rather than parallel dispatch

D. The model produces significantly more accurate results on sequential workflows because it processes one task at a time without context switching

**Correct Answer:** A

**Explanation:** The determining factor is task dependencies. When subagents have dependent chains (B needs A's output, C needs B's output), sequential execution is required. Parallel execution is only appropriate for truly independent tasks. Forcing parallel execution on dependent tasks leads to coordination problems and rework. The architect must analyze the dependency graph before deciding.

**Source:** Exam Guide §Task 1.27

---

### q072 — Task 1.28

**Scenario:** Simple queries like 'what's my account balance' need no subagents, while complex ones like 'analyze our cloud costs and recommend optimizations' need multiple specialists.

**Question:** A multi-agent system receives queries of varying complexity: simple lookups, moderate analysis, and complex multi-domain investigations. How should the system allocate subagents?

**Options:**

A. Allocate the same fixed set of subagents to every incoming query to maintain consistency and avoid conditional logic in the coordinator layer

B. Process all queries directly within the coordinator without ever spawning subagents to eliminate orchestration latency from the system entirely

C. Always provision the maximum available number of subagents for every query to ensure the most thorough and comprehensive response possible

D. **[✓]** Apply dynamic subagent selection where the coordinator classifies query complexity and allocates only the appropriate agents for each request

**Correct Answer:** D

**Explanation:** Dynamic subagent selection based on query complexity is the correct pattern. Simple queries should be handled directly by the coordinator without spawning subagents (avoiding overhead). Complex queries should trigger appropriate subagent allocation. This balances efficiency with thoroughness and avoids the waste of over-engineering simple requests or under-resourcing complex ones.

**Source:** Exam Guide §Task 1.28

---

### q073 — Task 1.29

**Scenario:** The agent is investigating a security incident and must remember: incident timeline, affected systems, findings from each investigation phase, and remediation steps taken.

**Question:** A long-running agent needs to retain information across many conversation turns without losing it to context compression or summarization. How should critical information be managed?

**Options:**

A. **[✓]** Use structured facts blocks within context for active data and write detailed findings to external scratchpad files as a persistent memory layer

B. Trust the model's in-context memory to reliably retain all investigation details across the full duration of a long multi-hour agentic session

C. Retain only the most recent ten messages in the active context window and compress all earlier content into a compact archive for reference

D. Store all findings to a relational database and issue structured queries against it whenever the agent needs to retrieve previously gathered data

**Correct Answer:** A

**Explanation:** Agent memory and context retention requires a defense-in-depth approach: (1) maintain a structured facts block within the current context for active information, (2) write detailed findings to external scratchpad files periodically, and (3) use summarization to compress older turns while preserving key data. Redundancy is important because context management mechanisms may lose information.

**Source:** Exam Guide §Task 1.29

---

### q074 — Task 1.30

**Scenario:** Various analysis tools return results in different formats. The agent needs to normalize all results into a consistent structure (finding type, severity, file, line, description) before further processing.

**Question:** A team of developers is building an AI-powered code analysis tool that needs to transform tool results after execution to format them consistently. What hook mechanism should they use?

**Options:**

A. Rely on the model to detect format inconsistencies in tool outputs and reformat them correctly within its natural language reasoning process

B. **[✓]** Implement a PostToolUse hook to intercept and transform tool results into the standardized finding structure before they reach the model

C. Accept heterogeneous tool output formats throughout the agent pipeline and normalize everything during the final report rendering phase only

D. Establish a developer convention requiring all team members to manually format their individual tool outputs to match the required structure

**Correct Answer:** B

**Explanation:** A PostToolUse hook is the correct mechanism for transforming tool results after execution but before they reach the model. It normalizes results into a consistent structure regardless of the source tool. This ensures the model always receives data in the expected format and keeps transformation logic centralized rather than distributed across tool implementations.

**Source:** Exam Guide §Task 1.30

---

### q075 — Task 1.31

**Scenario:** An automated code review agent should make no more than 50 tool calls per session to control API costs. If the limit is exceeded, the session should terminate.

**Question:** An agent needs to limit the total number of tool calls made in a single session to prevent runaway costs. What configuration mechanism enforces this limit?

**Options:**

A. **[✓]** Configure a maximum tool call limit in the agent SDK settings to terminate the session programmatically when the specified threshold is reached

B. Specify the session tool call limit in the system prompt as an instruction and ask the model to self-monitor its own cumulative tool usage

C. Monitor tool call counts via an external observer process and terminate the running agent process manually when the threshold is exceeded

D. Remove low-priority tools from the available configuration so that the agent has fewer options and naturally makes fewer total tool invocations

**Correct Answer:** A

**Explanation:** Agentic loop safety guards should be configured in the agent SDK settings. This includes maximum tool call limits per session, maximum consecutive tool calls, and maximum token usage. These are programmatic limits enforced by the SDK, not advisory instructions. When exceeded, the session terminates gracefully with a clear reason.

**Source:** Exam Guide §Task 1.31

---

### q076 — Task 1.32

**Scenario:** A code generation tool accepts a 'language' parameter. An attacker could try to inject instructions through this parameter to override the system prompt.

**Question:** A security architect wants to add input validation to prevent prompt injection through tool parameters. What mechanism should be used?

**Options:**

A. Remove all string-type parameters from tool definitions entirely to eliminate the surface area available for parameter-based injection attacks

B. **[✓]** Implement a PreToolUse hook that validates and sanitizes incoming tool call parameters before they are executed against the target system

C. Use only tools that include built-in input sanitization and injection detection mechanisms implemented within their own execution logic

D. Rely on the model's training to detect and reject prompt injection attempts embedded in tool parameter values without additional intervention

**Correct Answer:** B

**Explanation:** Tool call interception via PreToolUse hooks is the appropriate mechanism for security validation. The hook runs before the tool executes and can inspect parameters for injection patterns, block suspicious calls, sanitize inputs, or log the attempt. Programmatic validation in the hook layer is more reliable than relying on the model to detect injection attempts.

**Source:** Exam Guide §Task 1.32

---

### q121 — Task 1.13

**Scenario:** The system has a coordinator agent that delegates research tasks to subagents for competitor analysis, customer sentiment, and pricing trends. Each subagent produces findings the coordinator synthesizes.

**Question:** An architect is designing a multi-agent research system where a coordinator delegates to specialized subagents. Which principles should guide the tool and context design between the coordinator and subagents? (Select all that apply.)

**Options:**

A. **[✓]** Each subagent should maintain strict context isolation from other subagents to prevent information leakage and cross-agent context pollution

B. The coordinator should pass the complete multi-agent system conversation history to each subagent for full situational awareness during analysis

C. **[✓]** Each subagent should receive only the context and tools directly relevant to its specific assigned investigation task to minimize distraction

D. All subagents should share access to a common centralized tool pool to maximize operational flexibility and coverage across all agent roles

**Correct Answers:** A, C

**Explanation:** The correct principles are context isolation and least-privilege tool assignment. Each subagent should receive only the context and tools relevant to its task (option 2) to prevent distraction and reduce token costs. Subagents must maintain context isolation from each other (option 0) to avoid information leakage and context pollution. Passing full conversation history (option 1) would dilute focus and waste tokens. A shared tool pool (option 3) violates least-privilege principles.

**Source:** Exam Guide §Task 1.13

---

## D2: Tool Design & MCP Integration (23 questions)

### q017 — Task 2.1

**Scenario:** The agent misidentifies which tool to use for a given task about 30% of the time, leading to wasted tool calls and incorrect results.

**Question:** A code analysis agent has three tools with descriptions that read Finds files matching a name pattern, Searches code for specific text patterns, and Reads file contents by given path. The model frequently selects the wrong tool for a given request, calling the search tool when it should read a file and vice versa. Which approach would most effectively improve the model tool selection accuracy?

**Options:**

A. Add a request pre-processing classifier that programmatically analyzes each query and injects the selected tool name before model inference begins

B. **[✓]** Expand each tool's description to include explicit usage scenarios, example inputs, expected outputs, and clear differentiation from similar tools

C. Consolidate all three tools into a single unified tool with an internal routing engine that selects the correct backend implementation automatically

D. Reduce the total number of tools available to the model by consolidating overlapping capabilities into a smaller set of broader-purpose tools

**Correct Answer:** B

**Explanation:** The key is to expand tool descriptions to include detailed guidance on when and when not to use each tool. Descriptions should include concrete usage examples, clear differentiation from similar tools, and explicit exclusion criteria. Simply renaming tools does not help the model distinguish between them. Good descriptions act as documentation embedded in the tool definition.

**Source:** Exam Guide §Task 2.1

---

### q018 — Task 2.2

**Scenario:** The subagents include: a style checker (needs eslint), a security scanner (needs semgrep), a dependency analyzer (needs npm audit), a test runner (needs jest), and a documentation generator (needs typedoc).

**Question:** An architect is designing a multi-agent code analysis system with five specialist subagents, each needing access to different tools. What is the correct principle for tool distribution?

**Options:**

A. Expose all tools through a shared MCP server accessible equally by every subagent, allowing any agent to call any tool when needed

B. **[✓]** Grant each subagent only the specific domain tools relevant to its assigned task, scoping access strictly to its area of responsibility

C. Consolidate all five specialist roles into a single highly capable agent that possesses all tools and delegates work to itself internally

D. Provide all five tools to every subagent to ensure maximum operational flexibility and avoid situations where a subagent lacks a needed capability

**Correct Answer:** B

**Explanation:** Each subagent should receive only the tools scoped to its specific domain. Scoped tool access per subagent prevents confusion, reduces the chance of calling the wrong tool, and keeps each agent focused on its responsibility. Giving every tool to every agent increases the cognitive load on the model and raises the risk of inappropriate tool selection.

**Source:** Exam Guide §Task 2.2

---

### q019 — Task 2.3

**Scenario:** The payment tool can fail due to network timeouts (transient), invalid input (validation), or insufficient funds (business rule). The coordinator needs to handle each differently.

**Question:** An API gateway agent integrates with a payment processor tool that can fail in various ways. How should the agent communicate errors back to the coordinator for proper recovery?

**Options:**

A. Return a generic operation failed message for all error conditions to keep response structures simple and consistent across all failure types

B. Allow the payment tool to raise unhandled exceptions that crash the agent process so that errors are immediately visible and unmistakable

C. **[✓]** Return a structured error response with an errorCategory field that classifies failures so the coordinator can apply the correct recovery action

D. Log the specific error details internally and instruct the coordinator to always retry the same operation regardless of the failure reason

**Correct Answer:** C

**Explanation:** Structured error responses with an errorCategory field enable the coordinator to apply appropriate recovery strategies: transient errors should be retried with backoff, validation errors should fix the input, and business errors should escalate to a human. Generic error messages deprive the coordinator of the context needed for intelligent recovery.

**Source:** Exam Guide §Task 2.3

---

### q020 — Task 2.4

**Scenario:** The tool fails about 5% of the time with timeout errors that typically resolve within 2-3 seconds.

**Question:** A tool occasionally fails with transient network errors. The agent needs to handle these robustly. What retry strategy is most appropriate?

**Options:**

A. Retry immediately up to ten consecutive times as fast as possible without any delay to recover from the transient failure as quickly as possible

B. Attempt the operation once immediately and then escalate directly to an automated monitoring alert on the very next consecutive failure

C. **[✓]** Use exponential backoff with increasing delays between attempts, a jitter factor, and a bounded maximum retry count before giving up

D. Wait a fixed thirty-second delay before performing a single retry attempt, then escalate to an error queue if the second attempt also fails

**Correct Answer:** C

**Explanation:** Exponential backoff with a reasonable maximum delay and retry count is the standard pattern for transient errors. It starts with short delays and increases exponentially (e.g., 1s, 2s, 4s, 8s), giving the system time to recover while not overwhelming it with retries. Immediate retries in a tight loop can exacerbate the problem, and a single fixed-delay retry may not be sufficient.

**Source:** Exam Guide §Task 2.4

---

### q021 — Task 2.5

**Scenario:** The synthesis agent collects findings from research agents and must verify conflicting claims. You want to give it just enough access to verify facts without granting full tool access.

**Question:** A multi-agent system has a synthesis agent that needs to verify facts across multiple source agents. The synthesis agent should not have access to all tools, but needs a specific verification capability. How should this be implemented?

**Options:**

A. Grant the synthesis agent the same complete tool set as the research agents to ensure it can independently verify any claim it encounters

B. **[✓]** Create a scoped verify_fact tool available exclusively to the synthesis agent, providing targeted cross-reference capability without full tool access

C. Prohibit the synthesis agent from performing any verification, requiring it to accept all research agent findings as authoritative without checking

D. Require the synthesis agent to route all verification requests through the coordinator, which then delegates back to appropriate research agents

**Correct Answer:** B

**Explanation:** A scoped cross-role tool (verify_fact) that is available only to the synthesis agent provides the precise capability needed without exposing unnecessary tools. This follows the principle of least privilege: each agent gets only the tools it needs. The synthesis agent needs verification ability but does not need raw search or analysis tools.

**Source:** Exam Guide §Task 2.5

---

### q022 — Task 2.6

**Scenario:** The team uses a shared repository with common MCP servers for linting, testing, and deployment. Individual developers need to add personal utility tools without affecting the team configuration.

**Question:** A team wants to share MCP server configuration for their project while allowing individual developers to add personal tools. What is the correct configuration file structure?

**Options:**

A. Store team-wide MCP configuration in CLAUDE.md and individual developer additions in a separate local .env file committed to the repository

B. **[✓]** Use .mcp.json at the project root for team-shared configuration and ~/.claude.json for personal additions that remain outside version control

C. Duplicate the entire team configuration into each individual developer's local workspace directory to avoid any shared file dependency conflicts

D. Maintain a single shared configuration file that all team members edit locally in their clones to keep team and personal settings together

**Correct Answer:** B

**Explanation:** MCP server configuration follows a layering strategy: .mcp.json at the project root is shared via version control for team-wide tools, while ~/.claude.json (or ~/.claude/settings.json) contains personal additions. Settings are merged with project-level settings taking priority for shared config and user-level settings for personal additions.

**Source:** Exam Guide §Task 2.6

---

### q023 — Task 2.7

**Scenario:** The team built a custom code analysis MCP tool that provides richer results than the built-in Read tool, but the model chooses the built-in tool 70% of the time.

**Question:** A developer notices that when multiple tools are available, the model frequently uses built-in tools (like Read or Grep) instead of the team's custom MCP tools that provide better analysis. How should this be addressed?

**Options:**

A. **[✓]** Enhance the MCP tool description to clearly articulate its advantages over built-in alternatives and specify the scenarios where it should be preferred

B. Rename the MCP tool to begin with read or grep so the model's name-matching heuristics cause it to prefer the custom tool over the built-in

C. Disable built-in tools selectively in the configuration settings to reduce the option space and steer the model toward custom MCP tool usage

D. Remove the built-in Read and Grep tools from the active configuration entirely so the model has no alternative but to use the MCP tool instead

**Correct Answer:** A

**Explanation:** To compete effectively with built-in tools, the MCP tool description must be enhanced to clearly articulate its advantages. Explain what it does better, what additional analysis it provides, and in what scenarios it should be preferred. The model selects tools based on descriptions, so a more informative description directly influences selection behavior.

**Source:** Exam Guide §Task 2.7

---

### q024 — Task 2.8

**Scenario:** The codebase has 5,000+ files across multiple directories. The developer needs to find every usage of 'deprecatedApiCall()' to plan a migration.

**Question:** A developer needs to find all occurrences of a deprecated API function across a large codebase. Which built-in tool is most appropriate for this task?

**Options:**

A. **[✓]** Use the Grep tool to perform a regex pattern search across all files in the codebase and return every matching occurrence with file and line context

B. Deploy a custom MCP tool built specifically for this codebase's architecture and symbol naming conventions to locate the deprecated function usage

C. Open each file individually using the Read tool and scan its contents manually to locate all occurrences of the deprecated function call

D. Use the Glob tool to retrieve all file paths matching a source-file pattern and then inspect each returned file for the deprecated function name

**Correct Answer:** A

**Explanation:** The Grep tool is designed for searching file contents across a codebase. It performs regex pattern matching across files, which is exactly what this scenario requires. Glob matches file paths, not contents. Read can only handle individual files and would be extremely inefficient for a codebase of this size.

**Source:** Exam Guide §Task 2.8

---

### q025 — Task 2.9

**Scenario:** The project has a deeply nested directory structure with source files, test files, and configuration files mixed together.

**Question:** A developer needs to list all test files in a project that follow the naming convention '*.test.ts' or '*.spec.ts'. Which built-in tool is most appropriate?

**Options:**

A. Traverse the directory tree recursively using Read, collect all file paths returned, and then manually filter the results for matching extensions

B. **[✓]** Use the Glob tool with a pattern like **/*.{test,spec}.ts to efficiently match all test and spec files regardless of their nesting depth

C. Execute a shell command using the Bash tool to find all test files matching the naming convention throughout the project directory tree

D. Use the Grep tool to recursively search each subdirectory for filenames that match the test or spec naming patterns across the project structure

**Correct Answer:** B

**Explanation:** The Glob tool is designed specifically for file path pattern matching. A glob pattern like **/*.{test,spec}.ts will efficiently match all test and spec files regardless of directory depth. Grep searches file contents, not paths, making it unsuitable for this task.

**Source:** Exam Guide §Task 2.9

---

### q026 — Task 2.10

**Scenario:** A file has 50 lines containing 'margin: 10px', and you need to change only one specific occurrence. The Edit tool reports it cannot find a unique match.

**Question:** The Edit tool fails to find a unique match for a replacement in a file with many similar lines. What is the correct fallback approach?

**Options:**

A. Switch to an external IDE editor to perform the targeted single-line change manually outside of the Claude Code session environment

B. Apply the replacement to all fifty matching occurrences simultaneously and then manually identify and revert the unintended changes afterward

C. **[✓]** Use Read to retrieve the specific file region containing the target line and use Write to rewrite the file with the precise change incorporated

D. Resubmit the identical Edit tool call with the same search string to attempt a second match, hoping the tool resolves ambiguity on retry

**Correct Answer:** C

**Explanation:** When Edit cannot find a unique match, the correct fallback is to use Read to read the portion of the file containing the target line, then use Write to rewrite the file with the change incorporated (or use Edit with expanded surrounding context to disambiguate). Write with the full file content ensures the change is made precisely where needed.

**Source:** Exam Guide §Task 2.10

---

### q027 — Task 2.11

**Scenario:** A 'query_database' tool returns complete row data including audit fields, metadata, and timestamps. The coordinator agent only needs customer_name, amount, and status.

**Question:** A database query tool returns results with 50 columns per row, but the agent only needs 3 columns for its analysis. The excessive data is consuming context window space. How should this be addressed?

**Options:**

A. Request that the database team restructure the schema to remove non-essential columns and reduce the default row width for all query results

B. **[✓]** Implement a PostToolUse hook that intercepts the query result and filters it down to only the three columns needed before it reaches the model

C. Instruct the model via the system prompt to disregard irrelevant columns present in the tool output when performing its downstream analysis

D. Replace the current query tool with an alternative tool that reads from a pre-aggregated denormalized view containing only the essential columns

**Correct Answer:** B

**Explanation:** A PostToolUse hook can intercept tool results and filter excessive fields before the result is added to the conversation. This preserves context window space by eliminating irrelevant data. The hook runs after the tool executes but before the result is presented to the model, making it transparent and efficient.

**Source:** Exam Guide §Task 2.11

---

### q077 — Task 2.12

**Scenario:** The MCP server needs to be accessible from multiple client processes running on different machines within the same network.

**Question:** A team is building an MCP server for a code analysis tool. They need to choose between stdio and SSE transport. What factor most strongly favors SSE over stdio?

**Options:**

A. stdio transport should always be preferred over SSE because it is simpler to configure and requires no HTTP infrastructure to operate

B. **[✓]** SSE transport is the correct choice when the MCP server must be accessible to multiple clients over a network rather than as a local subprocess

C. SSE transport is exclusively designed for browser-based clients and cannot be used for CLI-based MCP server deployments in backend systems

D. stdio transport is only suitable for single-process local communication and cannot support any form of multi-client or remote access pattern

**Correct Answer:** B

**Explanation:** SSE (Server-Sent Events) transport is the appropriate choice when the MCP server needs to be accessible over a network, serving multiple clients remotely. stdio transport is limited to local processes where the client spawns the server as a subprocess. SSE enables client-server communication over HTTP, which is necessary for remote and multi-client scenarios.

**Source:** Exam Guide §Task 2.12

---

### q078 — Task 2.13

**Scenario:** The system needs tools for: code analysis, dependency management, deployment, monitoring, and testing. Some tools are closely related and often used together.

**Question:** An architect is designing a tool ecosystem with multiple MCP servers, each providing related tools. What is the correct principle for distributing tools across servers?

**Options:**

A. Distribute tools randomly across multiple servers to balance the load and avoid any single MCP server becoming a performance bottleneck

B. Create a dedicated MCP server per individual tool to maximize isolation, independent deployability, and fine-grained access control per tool

C. Place every available tool in a single monolithic MCP server to minimize configuration overhead and simplify client connection management

D. **[✓]** Distribute tools across MCP servers by domain, grouping related tools that are commonly used together into the same server for cohesion

**Correct Answer:** D

**Explanation:** Tools should be distributed across MCP servers by domain, grouping related tools together. This follows the principle of cohesion: tools that are often used together should be in the same server for efficient discovery and configuration. Overly granular servers (one per tool) create configuration overhead, while monolithic servers mix unrelated concerns.

**Source:** Exam Guide §Task 2.13

---

### q079 — Task 2.14

**Scenario:** Developers and the model are confused about which tool to use because the names are semantically overlapping.

**Question:** A team is naming tools in their MCP server. They have tools like 'get_user_data', 'fetch_user_data', and 'retrieve_user_profile' that all do similar things. What naming convention problem does this illustrate?

**Options:**

A. All retrieval tools should share identical names and rely on parameter differences alone to communicate their distinct behavioral characteristics

B. Tool names should be kept as short as possible, ideally single characters or abbreviations, to minimize token consumption in every API call

C. The naming scheme is well-designed because each synonym accurately conveys a distinct retrieval mechanism that the model can differentiate

D. **[✓]** Tool names should use consistent conventions with clear semantic differentiation between tools performing similar but distinct operations

**Correct Answer:** D

**Explanation:** Tool names should follow consistent naming conventions that make their purpose and differentiation clear. Using prefixes or namespaces (e.g., user:get_profile vs user:get_orders) and avoiding synonyms (get, fetch, retrieve) reduces confusion. Consistent naming improves discoverability for both human developers and the model, which selects tools based on names and descriptions.

**Source:** Exam Guide §Task 2.14

---

### q080 — Task 2.15

**Scenario:** The MCP server provides tools to query employee data, financial records, and customer information. It will be used by multiple agents in the organization.

**Question:** A team is deploying an MCP server that accesses sensitive internal APIs. What security considerations are most important?

**Options:**

A. No security controls are needed since MCP servers communicate over loopback interfaces and are therefore inaccessible to external attackers

B. **[✓]** Implement client authentication, authorize each agent's tool access scope, enforce least privilege, and audit all tool invocations thoroughly

C. Encrypting all data in transit is the only required security control since confidentiality is the primary concern for internal API access

D. Network-level perimeter controls like VPN and firewall rules are sufficient and eliminate the need for application-layer authentication entirely

**Correct Answer:** B

**Explanation:** MCP authentication and security requires: (1) authentication to verify the identity of the calling client, (2) authorization to ensure the caller has permission for the specific tool, (3) least-privilege access where each agent only gets the tools it needs, and (4) audit logging of all tool invocations. MCP servers that access sensitive data must not assume network-level security is sufficient.

**Source:** Exam Guide §Task 2.15

---

### q081 — Task 2.16

**Scenario:** The task requires editing a specific function parameter in a file. The Edit tool sometimes cannot find unique matches in files with many similar lines.

**Question:** A developer is building a tool system and needs to decide between using built-in tools (Read, Write, Edit, Grep, Glob) and custom MCP tools for a code modification task. What is a known limitation of built-in tools?

**Options:**

A. Custom MCP tools consistently exhibit higher latency than built-in alternatives and therefore degrade overall agent session responsiveness

B. Built-in tools have no meaningful limitations and should always be the first choice over custom MCP tools for any code modification task

C. **[✓]** Built-in tools like Edit can fail on ambiguous matches and lack domain-specific validation logic that custom MCP tools can provide

D. Built-in tools are incompatible with multi-agent architectures and cannot be reliably used by subagents within coordinator-spawned sessions

**Correct Answer:** C

**Explanation:** Built-in tools like Edit are general-purpose and can struggle with ambiguous matches (e.g., many similar lines, complex replacements). They lack domain-specific logic. Custom MCP tools can provide more targeted functionality with application-specific validation and error handling. The architect should use built-in tools for general operations and custom tools for domain-specific needs.

**Source:** Exam Guide §Task 2.16

---

### q082 — Task 2.17

**Scenario:** The tool returns complete customer transaction histories. The agent only needs summary statistics (total count, total value, average per transaction) for its analysis.

**Question:** A database query tool returns very large result sets (500KB+) that consume excessive context window space. The results are needed for analysis but must be managed carefully. What strategy is most effective?

**Options:**

A. Reduce the total number of database queries executed per session to lower the aggregate data volume ingested into the context window

B. Replace the current query tool with a different tool configured to return fewer rows per response to avoid large result set accumulation

C. **[✓]** Implement result pagination at the tool level and use a PostToolUse hook to summarize large result sets into concise statistics for the model

D. Accept the full 500KB result payloads from the tool and allow the model to manage context pressure by deprioritizing verbose data naturally

**Correct Answer:** C

**Explanation:** Tool result size management requires a multi-layered approach: (1) implement pagination at the tool level so the model can request data in manageable chunks, (2) use a PostToolUse hook to summarize or transform verbose results into concise statistics, and (3) design tools that return only the data the model needs, not raw unprocessed datasets.

**Source:** Exam Guide §Task 2.17

---

### q083 — Task 2.18

**Scenario:** The team has 25 tools with descriptions averaging 5 words each. The model selects inappropriate tools about 20% of the time.

**Question:** An architect is reviewing a team's tool definitions. Many tools have descriptions like 'Finds files' or 'Searches code.' The model frequently mis-selects tools. What is the most likely cause?

**Options:**

A. Tool names are the primary signal the model uses for selection, so renaming tools would resolve most of the observed mis-selection behavior

B. The model is overloaded by twenty-five available tools and cannot reliably distinguish between them when so many options are presented at once

C. Fine-tuning the model on these specific tool definitions would enable it to internalize the correct selection logic for this particular domain

D. **[✓]** Tool descriptions are too brief, omitting usage scenarios, input/output context, and differentiation from functionally similar alternative tools

**Correct Answer:** D

**Explanation:** Tool description writing best practices require: detailed descriptions including usage scenarios (when to use this tool), input/output descriptions (what parameters are needed and what the result looks like), and differentiation hints (how this tool differs from similar ones). Brief descriptions like 'Finds files' do not give the model enough information to make accurate selections.

**Source:** Exam Guide §Task 2.18

---

### q084 — Task 2.19

**Scenario:** The MCP server's database connection fails intermittently. The calling agent needs to know whether to retry or report a failure.

**Question:** An MCP server encounters an error while processing a tool request. How should errors be communicated back to the calling agent?

**Options:**

A. Forward the raw low-level database exception message directly to the calling agent as the complete error response without any abstraction

B. Terminate the MCP server process immediately upon encountering any tool error so that the failure is unambiguous and immediately visible

C. Log the error internally only and return a successful acknowledgment response to the client to maintain session stability during transient issues

D. **[✓]** Return a structured error response that includes an error code, a failure category, and a human-readable description of the problem encountered

**Correct Answer:** D

**Explanation:** Error propagation from MCP servers should use the MCP protocol's structured error response format. The response should include an error code, a category (transient, validation, or internal), and a human-readable description. This allows the calling agent to determine the appropriate recovery action. Crashing the server or hiding errors are both inappropriate.

**Source:** Exam Guide §Task 2.19

---

### q085 — Task 2.20

**Scenario:** The MCP server is used by multiple development teams. Updates should not cause downtime or incompatibility with existing client configurations.

**Question:** A team deploys an MCP server that provides code analysis tools. They need to update the server with new tools and improved logic. What is the correct lifecycle approach?

**Options:**

A. **[✓]** Implement a versioned MCP server lifecycle with backward-compatible interface design, graceful rollout, and deprecation management for old versions

B. Deploy each server update on a new network port and update all client configurations to point to the new endpoint for each release cycle

C. Stop the running server, deploy the updated version, restart the service, and accept that connected clients will need to reconnect and reconfigure

D. Freeze the MCP server at its initial deployed state and avoid all post-deployment updates to ensure no disruption to existing client integrations

**Correct Answer:** A

**Explanation:** MCP server lifecycle management requires: (1) versioned endpoints to avoid breaking existing clients, (2) backward compatibility for tool interfaces, (3) graceful shutdown that lets in-flight requests complete, (4) startup health checks, and (5) possibly a discovery mechanism so clients can learn about server availability. Production MCP servers cannot be treated as ad-hoc processes.

**Source:** Exam Guide §Task 2.20

---

### q086 — Task 2.21

**Scenario:** The 'analyze_code' tool currently takes a 'path' parameter. The team wants to add a 'recursive' option. Existing agents call the tool without this parameter.

**Question:** A team needs to update a tool's behavior while maintaining compatibility with existing agents that already use it. What strategy should they follow?

**Options:**

A. Deprecate the current tool immediately and inform all dependent teams they must update their tool call implementations within a fixed deadline

B. Change the recursive parameter to required so callers are forced to explicitly opt in or out, making the new behavior contract explicit

C. Release an entirely new tool version with a different name to avoid any risk of breaking callers that depend on the original tool interface

D. **[✓]** Add the recursive parameter as optional with a default value matching the existing behavior so current callers continue working unchanged

**Correct Answer:** D

**Explanation:** Tool versioning should follow the principle of forward and backward compatibility. New parameters should be added as optional with sensible defaults so existing callers continue to work unchanged. The tool description should be updated to document the new capability. Creating entirely new tools for every change leads to proliferation and confusion.

**Source:** Exam Guide §Task 2.21

---

### q087 — Task 2.22

**Scenario:** The client needs to discover available tools, call one with parameters, and receive results or errors.

**Question:** An architect is designing an MCP server and needs to understand how the server communicates tool availability and results to the client. What is the correct protocol message flow?

**Options:**

A. Clients discover available tools by studying the server's source code or API documentation and then hardcode the tool names they intend to call

B. The server broadcasts tool results to all connected clients on a fixed interval without waiting for explicit tool invocation requests from clients

C. Clients guess available tool names based on naming convention patterns and probe the server to confirm which guessed names resolve successfully

D. **[✓]** The MCP protocol uses initialization-time capability negotiation where the server advertises its available tools for the client to discover and call

**Correct Answer:** D

**Explanation:** The MCP protocol message format follows a request-response pattern: (1) initialization and capabilities negotiation, where the server advertises its tools, (2) tool call requests from the client with parameters, and (3) tool result responses from the server with structured data or error messages. This follows JSON-RPC conventions with specific MCP-defined message types for tool discovery and invocation.

**Source:** Exam Guide §Task 2.22

---

### q122 — Task 2.10

**Scenario:** The MCP server must be accessible from multiple developer machines across different network segments. Some tools require access to sensitive internal APIs and proprietary codebases.

**Question:** A team is deploying an MCP server that provides code analysis tools across a distributed development environment. Which architectural decisions are appropriate for this remote deployment? (Select all that apply.)

**Options:**

A. Disable all authentication since MCP servers only ever communicate over local loopback interfaces inaccessible from external network locations

B. Use stdio transport since all MCP server deployments must run as local subprocess children of the calling client process architecture

C. **[✓]** Implement authentication and authorization mechanisms to verify client identities and scope each agent's access to only its required tools

D. **[✓]** Use SSE transport to enable the MCP server to communicate with clients over HTTP across different network segments and machines

**Correct Answers:** C, D

**Explanation:** For remote MCP deployments, SSE (Server-Sent Events) transport is appropriate (option 3) because it enables client-server communication over HTTP across network segments. Authentication and authorization are essential (option 2) when MCP servers access sensitive resources, including identity verification, least-privilege tool scoping, and audit logging. stdio transport (option 1) only works for local subprocesses. Disabling security (option 0) is never acceptable for production systems.

**Source:** Exam Guide §Task 2.10

---

## D3: Claude Code Configuration & Workflows (24 questions)

### q028 — Task 3.1

**Scenario:** The developer prefers 2-space indentation and specific import ordering, while the team standard is 4-space indentation with different import conventions.

**Question:** A project lead creates a CLAUDE.md file with detailed coding standards and testing conventions for the team repository. Senior developers who configured their environments weeks earlier have no issues following the standards. A new team member who just cloned the repository finds that Claude Code does not apply any of the documented conventions. Investigation reveals the instructions were placed in a user-level file and never migrated to project-level version-controlled configuration. Why does the new developer lack the conventions?

**Options:**

A. **[✓]** The instructions were placed in user-level configuration that is not version-controlled and therefore was never shared with the new developer

B. The instructions were placed in a subdirectory-level CLAUDE.md file, which limits their scope only to files within that specific directory

C. The new developer has conflicting preferences in their own user-level CLAUDE.md that override the project-level configuration hierarchy

D. The instructions use the @import syntax to reference external files, and that import resolution fails silently on the new developer's machine

**Correct Answer:** A

**Explanation:** The user-level CLAUDE.md (typically at ~/.claude/CLAUDE.md) is not version-controlled and is intended for personal preferences. Team conventions belong in the project-level CLAUDE.md which is checked into version control. This layering allows individual customization without affecting the team standard.

**Source:** Exam Guide §Task 3.1

---

### q029 — Task 3.2

**Scenario:** The monolithic CLAUDE.md is difficult to maintain. Different team members need to update different sections, and merge conflicts are common.

**Question:** A team's CLAUDE.md file has grown to over 500 lines covering multiple concerns: code style, testing conventions, deployment steps, and architectural decisions. How should this be organized for maintainability?

**Options:**

A. Retain the entire file as-is but add clearly labeled section headers and inline comments to help contributors navigate the large document

B. Create separate CLAUDE.md files in each major project subdirectory so each team can own and maintain their own section independently

C. **[✓]** Use the @import syntax to compose multiple focused, independently-maintained files into the main CLAUDE.md through modular file references

D. Move all CLAUDE.md content to a team wiki and add a single reference link in the root CLAUDE.md pointing developers to the external documentation

**Correct Answer:** C

**Explanation:** The @import syntax allows modular CLAUDE.md configuration by importing content from separate files (e.g., @import ./style-guide.md). This enables teams to maintain focused, independently-editable files that are composed together at load time. This improves maintainability, reduces merge conflicts, and follows good software modularity principles.

**Source:** Exam Guide §Task 3.2

---

### q030 — Task 3.3

**Scenario:** The team has standardized CLI commands for common operations and wants Claude Code to be able to run them reliably within a project context.

**Question:** A team wants to create reusable project-scoped commands for common workflows like 'lint', 'test', and 'deploy' that can be invoked during Claude Code sessions. What is the correct approach?

**Options:**

A. **[✓]** Place executable command scripts in the project's .claude/commands/ directory so they become version-controlled reusable Claude Code commands

B. Add a dedicated commands section to the root CLAUDE.md file that lists each workflow with its full invocation syntax for the model to reference

C. Document all standard workflow commands in the project README and ask developers to copy and run them manually during their sessions

D. Add shell aliases for each workflow command to every developer's personal .bashrc or .zshrc file to make them available in terminal sessions

**Correct Answer:** A

**Explanation:** Project-scoped commands should be placed in the .claude/commands/ directory. Commands placed there become available to Claude Code within that project context. They can be invoked by name and support structured execution with defined inputs and outputs, making them more reliable than prompt-based command execution.

**Source:** Exam Guide §Task 3.3

---

### q031 — Task 3.4

**Scenario:** The skill takes user specifications and generates code snippets. Each invocation must start fresh without retaining state from previous uses.

**Question:** An architect is building a skill that should process user input and generate isolated output without leaking context between invocations. What configuration mechanism supports this isolation?

**Options:**

A. Deploy the skill as an independently running MCP server process so it maintains no shared state with the primary Claude Code session context

B. Prepend a system prompt section to the skill that explicitly resets all tracking variables and clears accumulated state at invocation start

C. Add a user-facing instruction in the skill description telling users to manually clear their session context between consecutive skill invocations

D. **[✓]** Configure context: fork in the skill's YAML frontmatter to create an isolated session for each invocation that cannot pollute the parent context

**Correct Answer:** D

**Explanation:** The context: fork frontmatter directive in a skill's configuration ensures each invocation creates an isolated session fork. This prevents context leakage between invocations, ensures clean state for each use, and maintains the main session's context uncontaminated by skill operations. It is the proper mechanism for output isolation.

**Source:** Exam Guide §Task 3.4

---

### q032 — Task 3.5

**Scenario:** The project is a full-stack application with React frontend, Node.js backend, and Python data processing scripts. Each area has different conventions.

**Question:** A development team needs conditional rules that apply only when working on specific parts of a project (e.g., frontend rules when editing React components, backend rules when editing API routes). How should this be configured?

**Options:**

A. Create a separate CLAUDE.md file at the root of each area so that each directory's rules automatically override the parent-level configuration

B. Consolidate all conditional rules into the .claude/settings.json configuration file and use flag-based conditions to enable each rule selectively

C. **[✓]** Define rules as individual files in .claude/rules/ using YAML frontmatter with path-pattern matchers for conditional, context-aware activation

D. Include all rules in a single root CLAUDE.md and add conditional if-frontend language to each rule to indicate its applicable scope

**Correct Answer:** C

**Explanation:** The .claude/rules/ directory supports files with YAML frontmatter that specify path patterns. Rules are conditionally applied when the current file matches the specified paths. This is the correct mechanism for context-sensitive, conditional rules that activate only when relevant to the current task.

**Source:** Exam Guide §Task 3.5

---

### q033 — Task 3.6

**Scenario:** The change is straightforward: renaming 'cachExpiry' to 'cacheExpiry' in a single configuration file. No other files are affected.

**Question:** A developer needs to fix a typo in a single variable name across one file. What is the appropriate execution mode for this task?

**Options:**

A. Open Plan mode first to perform a full impact analysis of the renaming before authorizing the agent to apply even this minimal change

B. Queue the rename as part of a larger batch refactoring task so it can be processed together with related changes for efficiency

C. Create a session fork before making the change so the original state is preserved and the rename approach can be verified safely first

D. **[✓]** Use direct execution mode to apply the straightforward single-file rename immediately without the overhead of a separate planning phase

**Correct Answer:** D

**Explanation:** For simple, single-file changes with clearly bounded impact, direct execution is the most appropriate mode. Plan mode adds unnecessary overhead for trivial changes that do not require architectural analysis. The developer should match the execution mode to the complexity of the task.

**Source:** Exam Guide §Task 3.6

---

### q034 — Task 3.7

**Scenario:** The restructuring affects 40+ files across 8 packages. The approach needs careful planning to ensure correct dependency management.

**Question:** A developer needs to restructure a monolithic application into a microservices architecture, which involves creating new packages, extracting interfaces, and updating cross-module imports. What execution mode is most appropriate?

**Options:**

A. Submit all changes as a single non-blocking batch request so the restructuring can be processed asynchronously without holding up the developer

B. Proceed directly with execution across all forty files in a single session since the developer already understands the target architecture well

C. Refactor files incrementally without a global dependency plan, allowing the model to adapt its approach organically as each change is applied

D. **[✓]** Engage Plan mode to analyze the current architecture, design the target structure, and produce an approved dependency plan before any execution

**Correct Answer:** D

**Explanation:** Plan mode is the correct choice for large-scale multi-file restructuring. It allows the agent to first analyze the current architecture, design the target structure, identify dependencies, and present a plan to the developer. After plan approval, execution can proceed with confidence. Direct execution on complex restructurings risks incomplete or inconsistent changes.

**Source:** Exam Guide §Task 3.7

---

### q035 — Task 3.8

**Scenario:** The agent generates code review findings. Most reports follow the required format, but about 15% deviate, requiring manual reformatting.

**Question:** A team needs the agent to consistently output error reports in a specific structure: severity, file location, description, and suggested fix. The model occasionally deviates from this format. What technique improves consistency?

**Options:**

A. Strengthen the system prompt formatting instructions with more precise and detailed language to reduce the remaining fifteen percent deviation rate

B. Eliminate all strict formatting requirements and accept whatever structure the model naturally produces to reduce the burden on prompt engineering

C. **[✓]** Provide concrete before-and-after formatting examples in the prompt that anchor the model's output to the expected structure across all scenarios

D. Require developers to post-process all model-generated reports through a manual reformatting step before they enter the downstream pipeline

**Correct Answer:** C

**Explanation:** Concrete before/after examples are more effective than abstract formatting instructions. Showing the model examples of what correct output looks like for different scenarios anchors its understanding. This is particularly important for structured output where the model needs to map abstract rules to concrete formats consistently.

**Source:** Exam Guide §Task 3.8

---

### q036 — Task 3.9

**Scenario:** The request is: 'Add an endpoint that allows users to delete their account.' There are many edge cases: active subscriptions, owned content, pending transactions, team memberships.

**Question:** A developer requests a new API endpoint. Before writing any code, what technique helps surface edge cases and potential issues?

**Options:**

A. Proceed directly to implementation since most account deletion edge cases are easily addressed with standard error handling in the application layer

B. Start with a minimal working implementation and rely on iterative testing and bug reports to surface and resolve edge cases over time

C. Build a comprehensive implementation upfront that attempts to handle all foreseeable edge cases in a single non-iterative development pass

D. **[✓]** Use the interview pattern to ask targeted questions about constraints and edge cases upfront and clarify all requirements before writing any code

**Correct Answer:** D

**Explanation:** The interview pattern involves asking targeted questions about edge cases, constraints, and business rules before any coding begins. This surfaces requirements that the developer may not have explicitly stated (like 'what happens to subscriptions on account deletion?'). It prevents wasted effort on implementations that miss critical requirements and is more efficient than iterative refinement.

**Source:** Exam Guide §Task 3.9

---

### q037 — Task 3.10

**Scenario:** The pipeline runs on every PR and needs Claude Code to analyze changes and post comments, then exit automatically.

**Question:** A CI/CD pipeline needs to run Claude Code to generate automated code review comments on pull requests. The pipeline should not block waiting for interactive input. What flag enables this?

**Options:**

A. Pass the interactive flag to maintain an open session that pauses at each step, allowing the pipeline to debug or intervene during execution

B. **[✓]** Pass the print flag to run Claude Code in non-interactive mode, reading from stdin and writing to stdout without entering an interactive loop

C. Pass the verbose flag to enable detailed diagnostic output that the pipeline can parse and monitor for completion and error conditions

D. Pass the resume flag to reconnect to a previous session state rather than starting a new session from scratch on each pipeline invocation

**Correct Answer:** B

**Explanation:** The -p or --print flag runs Claude Code in non-interactive mode, which reads input from stdin and prints output to stdout without entering an interactive loop. This is designed for CI/CD pipelines and automated workflows where no human interaction is available.

**Source:** Exam Guide §Task 3.10

---

### q038 — Task 3.11

**Scenario:** The agent generates review comments on every run. When a developer pushes new commits, the agent re-reviews the entire diff and re-reports previously identified issues that have already been fixed or acknowledged.

**Question:** An automated CI/CD pipeline runs Claude Code to perform code reviews. When the same PR is updated and re-reviewed, the agent repeats previously reported findings. How should this be addressed?

**Options:**

A. Reduce the total review scope to only the highest-severity issue categories to limit the volume of potentially repeated finding reports

B. **[✓]** Include the prior review's findings in the input context so the agent can detect and skip issues that have already been reported or resolved

C. Scope each review strictly to the diff between the current and previous commit so only newly introduced changes are analyzed each time

D. Accept that some repeated findings are an inherent limitation of automated review and ask developers to dismiss previously acknowledged items

**Correct Answer:** B

**Explanation:** Including prior review findings in the context enables the agent to perform deduplication. By knowing what was previously reported, the agent can skip already-fixed issues and focus only on new or remaining concerns. This requires passing the previous review output as part of the input context for the re-run.

**Source:** Exam Guide §Task 3.11

---

### q039 — Task 3.12

**Scenario:** The application needs to run linting, type checking, security scanning, and dependency audit as separate tasks that can be collected up to 24 hours later.

**Question:** An application needs to submit multiple independent code analysis tasks and collect results later without blocking the main workflow. Which API approach is most appropriate?

**Options:**

A. Use synchronous API calls for each analysis task in sequence, waiting for each response before submitting the next task in the pipeline

B. Open multiple simultaneous streaming connections, one per analysis task, and process each stream in parallel to minimize wall-clock latency

C. **[✓]** Use the Message Batches API to submit all independent tasks non-interactively and collect results asynchronously within the SLA window

D. Bundle all four analysis concerns into a single large synchronous API call with a combined prompt covering all required analysis dimensions

**Correct Answer:** C

**Explanation:** The Message Batches API is designed for non-blocking workflows where results can be collected later. It accepts batch submissions and processes them asynchronously, which is ideal for tasks with flexible SLAs. Synchronous APIs would block the main workflow, and streaming does not inherently support deferred collection.

**Source:** Exam Guide §Task 3.12

---

### q088 — Task 3.1

**Scenario:** The user-level CLAUDE.md specifies 4-space indentation, the project-level CLAUDE.md specifies 2-space indentation, and a subdirectory-level .claude/config specifies tab indentation.

**Question:** A team has configuration at the user level, project level, and directory level that may conflict. What is the correct resolution order when the same setting appears at multiple levels?

**Options:**

A. When all configuration levels conflict, the system ignores all of them and falls back to the default configuration values defined by Claude Code

B. **[✓]** Directory-level configuration takes the highest precedence, overriding project-level, which in turn overrides user-level configuration settings

C. User-level configuration always takes the highest precedence because individual developer preferences supersede all shared team configuration

D. Project-level configuration always wins over both user-level and directory-level settings because it represents the authoritative team standard

**Correct Answer:** B

**Explanation:** The CLAUDE.md hierarchy follows a specificity-based priority: directory-level overrides project-level, which overrides user-level. This allows teams to set base conventions at the project level while allowing more specific overrides in subdirectories. User-level settings are the baseline and are overridden by more specific project or directory settings.

**Source:** Exam Guide §Task 3.1

---

### q089 — Task 3.2

**Scenario:** The team has common workflows: 'summarize PR', 'generate changelog', 'run full test suite with coverage', and 'deploy to staging'. They want these as reusable commands.

**Question:** A team wants to create custom slash commands that team members can share and reuse across projects. What is the correct approach for creating and distributing custom commands?

**Options:**

A. Write up each workflow in a team wiki with detailed usage instructions and have developers manually invoke the steps during their sessions

B. **[✓]** Create command scripts in the project's .claude/commands/ directory so they become version-controlled, shared, and invocable slash commands

C. Embed all workflow definitions directly in the team's shared system prompt so the agent can execute them as part of its default behavior

D. Configure shell aliases for each workflow command in every developer's personal shell profile file to make them available in terminal sessions

**Correct Answer:** B

**Explanation:** Custom slash command creation and sharing is done through the .claude/commands/ directory at the project level. These command scripts are version-controlled, making them shareable with the entire team through the repository. They support structured inputs and outputs, making them more powerful and reliable than prompt-based workflows or shell aliases.

**Source:** Exam Guide §Task 3.2

---

### q090 — Task 3.3

**Scenario:** The skill needs specific instructions about coverage thresholds, report format, and tool access. It should not interfere with the main session's context.

**Question:** A developer wants to create a reusable skill that analyzes test coverage and generates reports. The skill should have its own instructions isolated from the main session. What configuration approach is correct?

**Options:**

A. **[✓]** Define the skill using a SKILL.md file with YAML frontmatter that includes context: fork to isolate each invocation from the parent session

B. Create a separate subdirectory-level CLAUDE.md that contains only the coverage analysis instructions scoped to the test directory location

C. Inject all skill-specific instructions directly into the system prompt at the beginning of each session where the skill might be invoked

D. Add all coverage analysis instructions and format specifications to the root CLAUDE.md file so they apply globally across all project tasks

**Correct Answer:** A

**Explanation:** Skill development uses SKILL.md with YAML frontmatter that defines the skill's metadata, including context: fork for isolation. The skill body contains specialized instructions. When invoked, the skill runs in its own forked context, keeping the main session uncontaminated. This is the proper mechanism for creating reusable, isolated capabilities.

**Source:** Exam Guide §Task 3.3

---

### q091 — Task 3.6

**Scenario:** The transformation involves cleaning data, validating schemas, and generating summary statistics. The files are independent and can be processed concurrently.

**Question:** A data engineering team needs to process 50 large CSV files through a transformation pipeline. Each file takes about 2 minutes to process. What is the recommended approach for batch processing?

**Options:**

A. Transform the files manually using a desktop spreadsheet application to apply the required cleaning and validation rules to each file in turn

B. Process one file per session in strict sequence, restarting the agent after each successful completion before proceeding to the next file

C. **[✓]** Use the Task tool to spawn parallel subagent tasks for each file, enabling concurrent independent processing across all fifty files simultaneously

D. Process all fifty CSV files one at a time in sequence within a single extended session to maintain a consistent shared transformation context

**Correct Answer:** C

**Explanation:** Batch processing with parallel Task tool invocations is the correct approach for independent file transformations. Multiple files can be processed concurrently by spawning parallel subagent tasks, dramatically reducing total wall-clock time. Sequential processing would take 100 minutes, while 10 parallel tasks could complete in approximately 10 minutes.

**Source:** Exam Guide §Task 3.6

---

### q092 — Task 3.7

**Scenario:** The frontend uses ESLint + Prettier, the API uses ESLint + Jest, shared types have no tooling, and deployment uses shell scripts. Different rules apply when working in each package.

**Question:** A team works on a monorepo containing multiple packages: a React frontend, a Node.js API, shared TypeScript types, and deployment scripts. Each package has different conventions and tools. How should Claude Code be configured for this monorepo?

**Options:**

A. Place a separate CLAUDE.md in each package directory and replicate all shared base conventions within each file to ensure complete coverage

B. Maintain a single root-level CLAUDE.md with all rules listed together and rely on the model to infer which rules apply to the current file

C. **[✓]** Apply directory-level configuration and conditional rules via .claude/rules/ files with path-pattern frontmatter for package-specific activation

D. Define all conditional rules within .claude/settings.json using a flag-based mechanism to selectively activate rules for each project area

**Correct Answer:** C

**Explanation:** For monorepos, use directory-level configuration and conditional rules via .claude/rules/ with path-pattern frontmatter. This allows each package to have its own conventions, tools, and rules that activate only when working within that package. Duplicating rules in separate CLAUDE.md files creates maintenance burden, and a single global configuration is too coarse.

**Source:** Exam Guide §Task 3.7

---

### q093 — Task 3.8

**Scenario:** The developer wants to set default model, temperature, and output preferences that apply everywhere, not just in one project.

**Question:** A team needs to configure Claude Code behavior settings that apply across all projects on a developer's machine. What file should they use?

**Options:**

A. Add the desired global settings to each individual project's .claude/ directory so every project inherits the configuration independently

B. **[✓]** Configure global behavior preferences in the user-level settings file at ~/.claude/settings.json so they apply across all projects automatically

C. Set global configuration through environment variable exports in the shell profile so Claude Code reads them at runtime from the environment

D. Apply global preferences through the IDE extension's settings panel so they persist across workspaces within that specific editor environment

**Correct Answer:** B

**Explanation:** The .claude/settings.json file at the user level (typically ~/.claude/settings.json) contains global configuration that applies across all projects. This is the correct location for user-wide preferences like default model selection, temperature settings, and output preferences. Project-level settings override user-level settings for project-specific configuration.

**Source:** Exam Guide §Task 3.8

---

### q094 — Task 3.9

**Scenario:** The chat assistant needs responses within 2 seconds. The batch analysis system processes files asynchronously and has no time pressure.

**Question:** A development team is configuring the agent SDK for different use cases: a real-time chat assistant needs low latency, while a batch code analysis system prioritizes throughput. How should agent SDK configuration differ?

**Options:**

A. Apply the SDK's default preset configuration uniformly to both use cases since defaults are engineered for broad applicability across scenarios

B. Use identical SDK configuration for both use cases since the agent SDK automatically detects and optimizes settings for each runtime context

C. Apply the SDK only to the real-time chat assistant and implement the batch analysis pipeline using direct API calls with custom configuration

D. **[✓]** Configure the agent SDK differently per use case, tuning settings like streaming, parallelism, and model selection to match each requirement

**Correct Answer:** D

**Explanation:** Agent SDK configuration should be tailored to each use case. The chat assistant needs: lower temperature for consistency, streaming for real-time responses, and potentially a faster but less capable model. The batch system needs: higher parallelism for throughput, non-streaming for efficiency, and batch processing capabilities. One-size-fits-all configuration does not optimize for different requirements.

**Source:** Exam Guide §Task 3.9

---

### q095 — Task 3.10

**Scenario:** The organization has 20 developers who each need API keys. Keys must be managed securely without being exposed in code or version control.

**Question:** An organization needs to configure API keys for Claude Code across multiple developer machines. What is the correct approach for API key management?

**Options:**

A. Store the API key in each project's CLAUDE.md or configuration file so developers have seamless access when they clone and open the project

B. Embed the API key in the project's package.json scripts section so it is automatically available when developers run project-defined commands

C. **[✓]** Store API keys in environment variables or a secrets manager, keeping them entirely out of all version-controlled files and shared configurations

D. Create a single shared API key stored in a team-accessible configuration repository that all twenty developers use for their Claude Code sessions

**Correct Answer:** C

**Explanation:** Claude Code authentication and API key management should use environment variables (like ANTHROPIC_API_KEY) or the Claude Code settings system. API keys must never be committed to version control or stored in project configuration files that are shared. Each developer should have their own key or keys should be managed through a secure secrets manager.

**Source:** Exam Guide §Task 3.10

---

### q096 — Task 3.11

**Scenario:** Claude Code made changes to 15 files in a refactoring session. The developer needs to understand what changed, verify correctness, and accept or reject specific changes.

**Question:** A developer is reviewing a large diff produced by Claude Code. How should they efficiently review and manage the proposed changes?

**Options:**

A. Accept all agent-generated changes without review since the model was given accurate instructions and the task specification was sufficiently clear

B. Reject all generated changes and redo the refactoring manually to ensure every modification meets the developer's personal quality standards

C. Accept all changes as long as the automated test suite passes without failures, treating green tests as sufficient validation for all modifications

D. **[✓]** Use the diff view to examine each change, verify correctness, request clarifications on specific modifications, and selectively accept or adjust

**Correct Answer:** D

**Explanation:** File change management and diff handling should follow a structured review process: (1) review the diff for each file to understand what changed and why, (2) ask for explanations of specific modifications if needed, (3) request modifications for changes that look incorrect or suboptimal, and (4) selectively accept changes. Blind acceptance is risky; blanket rejection wastes effort.

**Source:** Exam Guide §Task 3.11

---

### q097 — Task 3.12

**Scenario:** The pipeline runs on every PR and has access to the repository, secrets, and deployment credentials. It uses Claude Code to suggest fixes for linting errors.

**Question:** A CI/CD pipeline needs to run Claude Code for automated code generation tasks. What permissions and security considerations are most important?

**Options:**

A. Allow Claude Code direct write access to the production deployment environment so it can verify that suggested fixes work in the live system

B. Host the Claude Code execution environment on a dedicated unrestricted server to ensure maximum capability and performance on every review run

C. **[✓]** Run Claude Code with minimal file system permissions scoped to the repository, avoid exposing secrets, and prevent access to production systems

D. Grant Claude Code access to all available repository secrets and deployment credentials so it can perform a fully comprehensive analysis of the PR

**Correct Answer:** C

**Explanation:** Claude Code in CI/CD pipelines requires strict security: (1) use the -p flag for non-interactive mode, (2) grant minimal permissions needed for the task, (3) restrict file system access to the repository, (4) never expose secrets to the agent's context, and (5) ensure the agent cannot access production environments. CI/CD is a high-risk environment for agent execution.

**Source:** Exam Guide §Task 3.12

---

### q098 — Task 3.13

**Scenario:** The project contains configuration files with secrets (which should never be read) and source code (which should be editable).

**Question:** A team wants to control which files Claude Code can access and modify in a sensitive project. What configuration mechanism should they use?

**Options:**

A. Rely on the model's instruction-following behavior to naturally avoid reading files that have been indicated as sensitive in the system prompt

B. Encrypt all sensitive configuration files so that the model's Read tool retrieves only ciphertext that it cannot interpret or extract secrets from

C. Relocate all sensitive configuration files to a completely separate directory tree outside the project root to physically separate them from source

D. **[✓]** Configure explicit allow lists and deny lists for file system access in Claude Code's security settings to programmatically enforce access boundaries

**Correct Answer:** D

**Explanation:** Claude Code permissions and security settings support configuring file system access controls, including allow lists and deny lists. This programmatically prevents the agent from reading or writing specific files or directories. This is essential for projects containing secrets, configuration files, or other sensitive data that should not be exposed to the agent.

**Source:** Exam Guide §Task 3.13

---

### q099 — Task 3.14

**Scenario:** The team wants to log all tool calls, validate inputs, enforce rate limits, and track usage metrics across all agents.

**Question:** A team needs to run custom logic before and after every Claude Code tool execution. What mechanism supports this?

**Options:**

A. Require developers to manually log their tool usage to a shared spreadsheet at the end of each working day for centralized tracking purposes

B. **[✓]** Use the PreToolUse and PostToolUse hooks provided by the agent SDK to register centralized custom logic that runs around all tool executions

C. Route all tool invocations through an external network proxy that intercepts requests and injects the required logging and validation behavior

D. Embed the required custom logic directly into each individual tool's implementation so it executes naturally as part of each tool's behavior

**Correct Answer:** B

**Explanation:** Custom hooks and event handlers provided by the agent SDK (PreToolUse, PostToolUse) are the correct mechanism for running logic before and after tool executions. These hooks are centralized, apply to all tools automatically, and cannot be bypassed. They support logging, validation, transformation, and interception use cases without modifying individual tool implementations.

**Source:** Exam Guide §Task 3.14

---

## D4: Prompt Engineering & Structured Output (26 questions)

### q040 — Task 4.1

**Scenario:** The agent's PR reviews average 30+ comments per 100 lines changed, covering everything from serious bugs to personal preferences about naming conventions.

**Question:** A team uses an agent to perform PR reviews. The reviewer provides detailed feedback on every line of code, including minor stylistic preferences that are not team standards. The volume of feedback causes review fatigue. How should the PR review criteria be structured?

**Options:**

A. Retire the AI-assisted review workflow entirely and revert to fully manual code review by human developers to eliminate the noise problem

B. Instruct the agent to produce fewer total comments per review without providing categorical guidance on which finding types to prioritize

C. **[✓]** Define explicit categorical criteria that specify which issue types to always report and which types to consistently skip in every review

D. Impose a hard maximum of five comments per pull request regardless of the number or severity of issues discovered in the changed code

**Correct Answer:** C

**Explanation:** Explicit categorical criteria are essential for effective PR reviews. The criteria should list what to report (functional bugs, security vulnerabilities, API compatibility breaks, performance issues) and what to skip (formatting preferences, naming style choices, minor refactoring suggestions). This focuses the review on high-value findings and reduces noise that causes review fatigue.

**Source:** Exam Guide §Task 4.1

---

### q041 — Task 4.2

**Scenario:** The agent processes CSV files and needs to check for: missing values, type mismatches, encoding issues, and boundary conditions. It handles missing values but often misses boundary conditions.

**Question:** An agent is asked to verify that a data processing pipeline handles all edge cases correctly. The prompt says 'check for edge cases' but the agent consistently misses specific types of edge cases. What is the root cause?

**Options:**

A. **[✓]** The prompt's vague language fails to enumerate specific edge case categories, so boundary conditions fall outside what the agent checks for

B. The agent requires a larger, more capable model to handle the full range of edge case identification across diverse data processing scenarios

C. The underlying model lacks sufficient capability to generalize the concept of edge cases to domain-specific data processing validation scenarios

D. Effective edge case detection inherently requires a domain-specific fine-tuned model rather than a general-purpose instruction-following model

**Correct Answer:** A

**Explanation:** The vague instruction 'check for edge cases' should be replaced with explicit criteria. For example, specify 'check for contradiction between source and target fields' or 'verify values at minimum and maximum numeric boundaries'. The model performs better with specific, actionable instructions than with abstract concepts that may have ambiguous interpretations.

**Source:** Exam Guide §Task 4.2

---

### q042 — Task 4.3

**Scenario:** The instructions specify a multi-section report with severity, affected component, description, and remediation. The format is correct about 85% of the time.

**Question:** Despite detailed instructions about output format, the agent occasionally deviates from the required structure when generating complex technical reports. What technique should be employed?

**Options:**

A. Simplify the report structure by reducing the number of required fields to lower the structural complexity and minimize formatting deviations

B. Accept the eighty-five percent compliance rate as adequate and allocate developer time to manually correcting the remaining format deviations

C. Raise the model temperature setting to increase the diversity of generated outputs and encourage more varied attempts at correct formatting

D. **[✓]** Supplement the prompt with two to three concrete examples of correctly formatted reports to anchor the model to the required output pattern

**Correct Answer:** D

**Explanation:** When instructions alone fail to produce consistent output, few-shot examples are the most effective solution. Providing 2-3 concrete examples of correctly formatted reports anchors the model's output to the expected pattern. Examples work better than additional instructions because they demonstrate rather than describe the expected format.

**Source:** Exam Guide §Task 4.3

---

### q043 — Task 4.4

**Scenario:** The pipeline extracts invoice data (invoice number, date, line items, totals) from PDF text. Downstream systems require strict JSON structure with specific field names and types.

**Question:** A team builds a structured data extraction pipeline that uses tool_use with a JSON schema containing required fields for invoice total vendor name and invoice date and an optional purchase order number field. During validation the team discovers that invoices without purchase order numbers consistently contain fabricated values like N-A or PO-00000 instead of null. Which schema design change would most effectively eliminate this hallucination?

**Options:**

A. Remove the purchase order number field entirely from the extraction schema and retrieve it through a separate targeted follow-up pass if needed

B. Mark the purchase order number as required with a predefined null literal default value to signal the model to return null for absent data

C. Add enum validation to the purchase order number field restricting accepted values to patterns that match known valid purchase order formats

D. **[✓]** Define the purchase order number field as nullable with schema description guidance directing the model to return null when the field is absent

**Correct Answer:** D

**Explanation:** Schema fields should be designed as nullable when source documents may not contain the information, preventing the model from fabricating values to satisfy required fields. Making the purchase order number field explicitly nullable in the schema definition with clear description guidance tells the model that null is an acceptable and expected value when the information is absent from the source document.

**Source:** Exam Guide §Task 4.4

---

### q044 — Task 4.5

**Scenario:** The schema requires fields like invoice_date (string), total_amount (number), and line_items (array). The model always returns valid JSON matching this schema.

**Question:** A JSON schema is used to enforce the structure of extracted data from documents. What does schema enforcement guarantee, and what does it not guarantee?

**Options:**

A. Schema enforcement verifies only that the JSON can be parsed without errors and makes no guarantees about field presence or data type compliance

B. **[✓]** Schema enforcement prevents structural syntax errors but does not prevent semantic errors such as incorrect values that satisfy type constraints

C. Schema enforcement guarantees both syntactic validity and semantic accuracy simultaneously, ensuring all extracted values are factually correct

D. Schema enforcement is unnecessary because language models consistently produce correctly structured output without additional constraint mechanisms

**Correct Answer:** B

**Explanation:** Schema enforcement prevents syntax errors (invalid JSON, wrong types, missing required fields) but does not prevent semantic errors. The model could return the correct structure with incorrect values: a wrong invoice number, an incorrectly calculated total, or a date that does not match the document. Semantic validation requires additional verification steps beyond schema checking.

**Source:** Exam Guide §Task 4.5

---

### q045 — Task 4.6

**Scenario:** The agent sometimes returns invoice data as free-text JSON in the assistant message instead of calling the designated tool, which breaks downstream processing.

**Question:** An extraction agent processes invoices and must always call the 'extract_invoice' tool, even when the model might consider directly answering in text. How can this be enforced?

**Options:**

A. **[✓]** Set tool_choice to type: tool with name: extract_invoice to programmatically enforce that the model must call that specific tool on every turn

B. Add a system prompt instruction explicitly directing the model to always invoke the extract_invoice tool rather than returning data as plain text

C. Implement post-processing logic that detects free-text JSON in assistant responses and converts it into the tool call format before downstream use

D. Remove all other tools from the configuration so the extract_invoice tool is the only callable option available to the agent during extraction

**Correct Answer:** A

**Explanation:** Forced tool selection via tool_choice: {type: 'tool', name: 'extract_invoice'} ensures the model must call the specified tool. This overrides the model's default behavior and guarantees structured output through the tool. Prompt instructions alone can be ignored by the model, but tool_choice with 'tool' type is programmatic and cannot be bypassed.

**Source:** Exam Guide §Task 4.6

---

### q046 — Task 4.7

**Scenario:** About 8% of extractions produce JSON with syntax errors like trailing commas or unquoted keys. The agent needs to recover without human intervention.

**Question:** A data extraction agent sometimes returns malformed JSON when extracting invoice data. What is the appropriate recovery strategy?

**Options:**

A. Log malformed extraction outputs to a queue and route them to a manual processing workflow for human correction and re-entry downstream

B. Switch to a rule-based extraction fallback that uses regex parsing rather than model-generated output for all future attempts on this document

C. Treat malformed JSON as acceptable partial output and pass it downstream with a flag indicating that format validation was not fully satisfied

D. **[✓]** Retry the extraction including the malformed output and a specific description of the syntax error as feedback for the model to correct

**Correct Answer:** D

**Explanation:** When format errors occur, the agent should retry with error feedback. Include the malformed output and a description of the error (e.g., 'The JSON had a trailing comma after the last array element. Please fix and retry.'). The model can typically correct its output when given specific error feedback. This recovery loop is more efficient than manual reprocessing.

**Source:** Exam Guide §Task 4.7

---

### q047 — Task 4.8

**Scenario:** The invoice format from a specific vendor does not include a tax ID field at all. The extraction is attempted 5 times with different prompting strategies, all failing.

**Question:** A document extraction agent consistently fails to extract the 'vendor_tax_id' field from certain invoices. Retrying with error feedback does not help. What is the most likely root cause?

**Options:**

A. **[✓]** Retries with error feedback cannot produce a field that is genuinely absent from the source document regardless of how the prompt is refined

B. The model is unable to recognize tax identifier formats in this invoice layout and requires additional few-shot examples to extract correctly

C. The model temperature is set too low, causing the model to under-explore the document and miss non-obvious field placement locations

D. The extraction schema is overly restrictive in its validation rules and is rejecting legitimate values that the model is successfully extracting

**Correct Answer:** A

**Explanation:** Retries with error feedback are ineffective when the required information is simply not present in the source document. No amount of retrying will extract a tax ID that was never printed on the invoice. The system should detect this situation by validating that the required fields actually exist in the source before retrying, and handle missing data gracefully (e.g., mark as 'not available' rather than retrying endlessly).

**Source:** Exam Guide §Task 4.8

---

### q048 — Task 4.9

**Scenario:** The processing must complete within 36 hours. Each report takes ~1 minute of processing time. The team has a budget-conscious approach and can accept processing starting within a few hours.

**Question:** A compliance team needs to process 10,000 quarterly reports with a 36-hour turnaround SLA. Each report requires complex analysis that takes approximately 1 minute. What submission strategy is optimal?

**Options:**

A. Submit all ten thousand reports individually as concurrent synchronous API requests, relying on connection pooling to handle the parallelism

B. **[✓]** Use a batch submission strategy that processes all reports within a twenty-four-hour window, well within the thirty-six-hour SLA requirement

C. Process all ten thousand reports one at a time synchronously, completing and waiting for each before submitting the next in sequence

D. Open streaming connections for all ten thousand reports simultaneously, processing each response stream in parallel for maximum throughput

**Correct Answer:** B

**Explanation:** A batch submission strategy with a 24-hour maximum window is appropriate. Batch processing allows submitting all 10,000 reports at once with results available within 24 hours, well within the 36-hour SLA. This is far more efficient than sequential processing and avoids rate limiting issues. The window should be configured to ensure completion before the SLA deadline.

**Source:** Exam Guide §Task 4.9

---

### q049 — Task 4.10

**Scenario:** The CI pipeline needs to block the merge until the review is complete. The developer has a 10-minute SLA for merge checks.

**Question:** A developer wants to use the Message Batches API for a pre-merge code review gate that must block the merge pipeline until results are available. Is this appropriate?

**Options:**

A. Yes, the Message Batches API is well suited to code review workflows when configured with a short enough processing window for the SLA

B. **[✓]** No, the Message Batches API is designed for asynchronous non-blocking use cases and is inappropriate for blocking synchronous pipeline gates

C. Yes, the batch window can be configured to complete processing within ten minutes when only a small number of review items are submitted

D. No, the Message Batches API lacks the capability to analyze code diffs or generate structured review comments for pull request workflows

**Correct Answer:** B

**Explanation:** The Message Batches API is designed for non-blocking, asynchronous processing with deferred result collection. It is inappropriate for blocking/pre-merge workflows where results are needed synchronously to gate a pipeline. For blocking workflows, use synchronous API calls or streaming to get results inline before proceeding with the merge decision.

**Source:** Exam Guide §Task 4.10

---

### q050 — Task 4.11

**Scenario:** The developer writes a complex algorithm and then asks the same agent to check for bugs and edge cases in the implementation.

**Question:** A developer uses Claude Code to review their own code changes before committing. They ask the same session to review the code it just wrote. What is the limitation of this approach?

**Options:**

A. The model is architecturally incapable of performing code review effectively regardless of whether it wrote the code being reviewed

B. **[✓]** Self-review within the same session suffers from confirmation bias and shared context blindness that limits the discovery of novel issues

C. There is no meaningful limitation because the same session can review its own output as effectively as an independent session would

D. Self-review is only viable when conducted by a different model variant that was not involved in generating the original implementation

**Correct Answer:** B

**Explanation:** Self-review within the same session suffers from confirmation bias and shared context blindness Ã¢â‚¬â€ the agent is operating with the same assumptions that led to the original implementation. An independent instance (separate session or separate agent) with a fresh perspective and no shared assumptions is significantly more effective at identifying issues and edge cases.

**Source:** Exam Guide §Task 4.11

---

### q051 — Task 4.12

**Scenario:** The review system must both identify correctness issues and explore edge cases. Single-pass approaches tend to favor one or the other.

**Question:** A team is building a code review system that generates comprehensive reports. They notice that the agent either produces thorough reviews but misses some edge cases, or generates great edge case analysis but with inconsistent coverage. What architectural pattern addresses this?

**Options:**

A. Select a larger, higher-capacity model to handle both review thoroughness and edge case analysis simultaneously within a single inference pass

B. **[✓]** Use a multi-pass architecture with one pass dedicated to implementation correctness review and a separate focused pass for edge case analysis

C. Combine both objectives into a single comprehensive system prompt with detailed instructions covering correctness and edge case coverage together

D. Apply random sampling of the codebase during each pass so that different code sections are evaluated for correctness and edge cases alternately

**Correct Answer:** B

**Explanation:** A multi-pass architecture separates concerns across different passes: one pass focuses on general implementation correctness, and a separate pass focuses specifically on edge case identification. Each pass has a focused objective and criteria. This separation produces more thorough coverage than trying to handle all concerns in a single pass, where attention is divided.

**Source:** Exam Guide §Task 4.12

---

### q100 — Task 4.1

**Scenario:** The system has a coordinator agent and 5 specialist agents, each with different responsibilities and tool access.

**Question:** An architect is designing prompts for a multi-agent system. What is the most important principle for system prompt design in this context?

**Options:**

A. Minimize system prompt length to a single descriptive sentence per agent to reduce token consumption and keep context space available

B. Use the same system prompt for every agent in the system to ensure all agents share a common baseline of behavioral expectations and values

C. Restrict system prompt content to output format specifications only and avoid including behavioral or role-defining guidance for any agent

D. **[✓]** Design role-specific system prompts that define each agent's purpose, capability scope, tool access, and behavioral boundaries for its role

**Correct Answer:** D

**Explanation:** System prompt design principles require role-specific prompts that clearly define: (1) the agent's purpose and role in the system, (2) its capabilities and tools, (3) its limitations and boundaries (what it should not do), and (4) behavioral guidelines for interaction. Each agent needs a prompt tailored to its function. A one-size-fits-all approach leads to role confusion and boundary violations.

**Source:** Exam Guide §Task 4.1

---

### q101 — Task 4.2

**Scenario:** The conversation involves the user providing requirements, the model asking clarifying questions, and the user answering. The model needs to track who said what.

**Question:** An architect is designing a conversation flow where the model needs to understand the difference between user-provided information and its own previous responses. How should messages be structured?

**Options:**

A. **[✓]** Assign proper user, assistant, and system roles to all messages so the model correctly attributes each statement to its originating source

B. Combine all messages into a flat array without role labels so the model processes the full conversation as a single undifferentiated text block

C. Concatenate the entire multi-turn conversation into one long user message before submitting to the API for each new turn in the dialogue

D. Classify all messages as user-turn messages to simplify the message structure and avoid managing multiple role types in the conversation array

**Correct Answer:** A

**Explanation:** Using proper user turn vs assistant turn message roles is essential for the model to correctly attribute information. The user role represents human-provided information, the assistant role represents the model's own previous responses, and the system role provides instructions. This role structure is fundamental to the model's understanding of conversation context and who said what.

**Source:** Exam Guide §Task 4.2

---

### q102 — Task 4.3

**Scenario:** The prompt includes: role definition (2 paragraphs), task instructions (3 bullet points), example inputs and outputs (5 examples), and output format requirements (4 specifications).

**Question:** An architect needs to structure a complex prompt with multiple sections: instructions, context, examples, and output format specifications. What structuring approach improves model comprehension?

**Options:**

A. Write all prompt components in a single contiguous paragraph to minimize token usage and avoid structural overhead from formatting elements

B. Place each distinct prompt section in a separate user or system message turn rather than combining them in a single structured message

C. **[✓]** Use descriptive XML tags such as instructions, context, examples, and output-format to clearly delineate and label each distinct prompt section

D. Separate sections using repeated dash or equals characters as visual dividers to indicate boundaries between different prompt components

**Correct Answer:** C

**Explanation:** XML tagging for structured prompts uses descriptive tags like &lt;instructions&gt;, &lt;context&gt;, &lt;examples&gt;, and &lt;output-format&gt; to clearly delineate sections. This improves the model's ability to parse and reference different parts of the prompt. XML tags are well-understood by the model and provide clear section boundaries that support reference (e.g., 'following the format specified in &lt;output-format&gt;').

**Source:** Exam Guide §Task 4.3

---

### q103 — Task 4.4

**Scenario:** The task requires: analyzing a system architecture, identifying potential failure modes, evaluating their impact, and recommending mitigations.

**Question:** An architect is designing a prompt for complex multi-step reasoning. The model should show its reasoning process before arriving at a conclusion. What prompting technique supports this?

**Options:**

A. **[✓]** Use chain-of-thought prompting to direct the model to reason through each analytical step explicitly before arriving at its final conclusions

B. Ask the model only for the final actionable recommendation and suppress the intermediate reasoning to minimize output length and token cost

C. Prompt the model to produce a rapid best-guess answer first, then verify the conclusion in a follow-up call if confidence appears uncertain

D. Provide a single high-level instruction directing the model to be accurate and thorough without specifying how it should structure its reasoning

**Correct Answer:** A

**Explanation:** Chain-of-thought prompting encourages the model to break down complex reasoning into explicit steps before arriving at conclusions. This produces more accurate results for multi-step analysis tasks and makes the reasoning transparent. The model should be prompted to show its analytical process, consider alternatives, and then present conclusions with supporting evidence.

**Source:** Exam Guide §Task 4.4

---

### q104 — Task 4.5

**Scenario:** A user asks a question, the assistant responds, the user asks a follow-up that shifts the topic slightly, then clarifies their original intent.

**Question:** A conversational AI system needs to maintain coherent context across multiple user turns while handling topic shifts and clarifications. What is the correct approach to multi-turn conversation management?

**Options:**

A. Process each user message as a fully independent and self-contained request, discarding all prior conversational turns before each API call

B. Retain only the single most recent user message in the context window and discard all prior turns including the assistant's previous responses

C. Reset the full conversation context after every third user turn to prevent accumulated context from influencing subsequent response quality

D. **[✓]** Maintain the structured conversation history with proper message roles and implement context management to handle topic shifts coherently

**Correct Answer:** D

**Explanation:** Multi-turn conversation management requires maintaining the structured conversation history (user and assistant messages) across turns. The agent needs to understand the full context, handle topic shifts gracefully, and manage the context window by summarizing older turns or pruning irrelevant content. Discarding history or treating each turn independently loses the conversational context needed for coherent responses.

**Source:** Exam Guide §Task 4.5

---

### q105 — Task 4.6

**Scenario:** The chatbot has access to customer data and can perform actions like looking up orders and processing returns. The system prompt instructs it to follow company policies.

**Question:** A team is building an AI-powered customer-facing chatbot. What measures should be taken to prevent users from manipulating the system prompt through crafted inputs?

**Options:**

A. Display a terms-of-service message at session start that explicitly prohibits users from attempting any form of prompt manipulation behavior

B. Remove all behavioral instructions from the system prompt to eliminate the attack surface that prompt injection exploits in chatbot systems

C. Rely entirely on the model's training to autonomously detect and neutralize all prompt injection attempts present in user-submitted inputs

D. **[✓]** Validate and sanitize user inputs before they reach the model, enforce behavioral constraints in the system prompt, and restrict tool visibility

**Correct Answer:** D

**Explanation:** Prompt injection prevention requires: (1) validate and sanitize user inputs before they reach the model, (2) constrain the model's behavior through the system prompt with explicit boundaries, (3) never expose tool names or capabilities in user-visible responses, (4) use input/output guards that filter suspicious patterns, and (5) implement the principle of least privilege for tool access.

**Source:** Exam Guide §Task 4.6

---

### q106 — Task 4.7

**Scenario:** The task is generating boilerplate code from templates where consistency is more important than creativity.

**Question:** An architect is configuring the model parameters for a code generation task that requires highly deterministic output. The system should produce the same output for the same input every time. What configuration is most appropriate?

**Options:**

A. Set a high temperature and high top_p value to encourage diverse and creative output variation across repeated code generation invocations

B. Set temperature to its maximum value to generate the widest variety of implementation patterns from which the best option can be selected

C. Temperature and top_p parameters have no measurable effect on output consistency and can be safely ignored for deterministic generation tasks

D. **[✓]** Set temperature to zero and top_p to one to minimize token selection randomness and produce the most consistent and repeatable output possible

**Correct Answer:** D

**Explanation:** For deterministic output, set temperature to 0 (or very close to 0) and top_p to 1. Temperature controls the randomness of token selection: 0 makes the model always choose the most likely token, producing consistent output. Top_p is an alternative sampling method; setting it to 1 disables its effect. For creative tasks, higher values are appropriate, but for deterministic code generation, low temperature is correct.

**Source:** Exam Guide §Task 4.7

---

### q107 — Task 4.8

**Scenario:** The code review summary should be concise enough to fit in a PR comment with a 500-token limit. The model sometimes generates verbose responses that exceed this limit.

**Question:** A developer needs to generate a code review summary that must not exceed 500 tokens. How should the model be configured to respect this constraint?

**Options:**

A. **[✓]** Set the max_tokens parameter to the desired token limit and optionally configure stop sequences to terminate generation at natural boundaries

B. Rely on the model's self-regulation to keep outputs concise, since language models naturally produce shorter responses to code review prompts

C. Reduce the size of the code input provided to the model so that shorter input naturally yields shorter model-generated summary output

D. Apply manual post-processing truncation to the raw API response output before it is delivered to the pull request comment submission endpoint

**Correct Answer:** A

**Explanation:** Max tokens and output length management requires setting the max_tokens parameter to the desired limit. This tells the API to stop generating once the limit is reached. Additionally, consider using stop sequences to terminate generation at natural break points. Post-generation truncation should be a last resort as it may cut off mid-sentence.

**Source:** Exam Guide §Task 4.8

---

### q108 — Task 4.9

**Scenario:** The model should generate only the code for a function, not the markdown code block closing or any subsequent explanation or commentary.

**Question:** An architect needs the model to generate code until it produces a complete function but stop before generating any explanatory text after the function. What mechanism supports this?

**Options:**

A. Include a system prompt directive saying only output code and no explanation and rely on the model to interpret and consistently honor it

B. Set a low max_tokens value that forces generation to stop before the model has enough budget to append any explanatory text to the output

C. **[✓]** Configure stop sequences such as closing code fence markers that halt token generation precisely when the code block boundary is encountered

D. Truncate the complete model response at a fixed character limit after the API call returns to remove any trailing explanatory text added

**Correct Answer:** C

**Explanation:** Stop sequences are one or more strings that, when generated by the model, signal the API to stop producing further tokens. For code generation, using stop sequences like ``` or \n``` halts generation at the end of the code block. This is more precise than max_tokens truncation and ensures the output ends at a clean boundary.

**Source:** Exam Guide §Task 4.9

---

### q109 — Task 4.10

**Scenario:** The user types code and the system should show completions in real-time, updating as the user continues typing.

**Question:** A real-time code completion feature needs to provide suggestions as the developer types. What API approach should be used for the best user experience?

**Options:**

A. **[✓]** Use the streaming API to receive and display completion tokens progressively as they are generated for a responsive real-time user experience

B. Submit a fresh complete API request for every individual keystroke event to ensure the model always generates based on the latest typed input

C. Collect keystrokes into timed batches and submit a single batch API request at regular intervals to reduce total API call volume

D. Pre-generate a comprehensive completion cache for all possible character combinations and serve suggestions directly from the local cache

**Correct Answer:** A

**Explanation:** Streaming responses are the correct approach for real-time interactive experiences. Streaming delivers tokens incrementally as they are generated, allowing the UI to display partial results immediately. This provides a responsive user experience. Full-response waiting creates noticeable latency, and pre-generation is impractical for open-ended completions.

**Source:** Exam Guide §Task 4.10

---

### q110 — Task 4.11

**Scenario:** The pipeline extracts structured data from documents. Downstream parsers expect strict JSON format with specific field names and types.

**Question:** A data extraction pipeline produces inconsistent output formats from the model despite detailed prompts. Some responses use JSON, others use YAML, and others use plain text. How should output format consistency be ensured?

**Options:**

A. Implement a post-processing conversion layer that normalizes all model-generated output into the required JSON format after each API response

B. Accept inconsistent output formats from the model and develop separate downstream parsers for each format variant that may be produced

C. Rely solely on a detailed system prompt instruction specifying the required JSON format and field names to enforce output structure consistency

D. **[✓]** Combine multiple reinforcing techniques including schema-enforced tool_use, few-shot examples, and explicit system prompt instructions together

**Correct Answer:** D

**Explanation:** Response format consistency requires a multi-layered approach: (1) use tool_use with a strict JSON schema for programmatic enforcement, (2) provide few-shot examples showing the exact expected output, and (3) reinforce with system prompt instructions. No single technique is perfectly reliable, but the combination provides defense in depth.

**Source:** Exam Guide §Task 4.11

---

### q111 — Task 4.12

**Scenario:** The team iterates on prompts for a customer support agent. They make changes based on intuition but cannot measure whether the changes actually improve outcomes.

**Question:** A team needs to systematically evaluate whether their prompt changes improve or degrade model performance. What methodology should they use?

**Options:**

A. Deploy the updated prompt directly to production and monitor customer satisfaction scores as the primary indicator of prompt quality improvement

B. **[✓]** Build a labeled evaluation dataset with representative inputs and expected outputs, then measure accuracy and consistency across prompt variants

C. Use developer intuition and peer feedback as the primary signals for evaluating whether a given prompt change represents a quality improvement

D. Conduct live A/B tests in production with real customer traffic without establishing baseline metrics or a structured measurement framework

**Correct Answer:** B

**Explanation:** Evaluation and testing of prompts requires a systematic methodology: (1) curate a test dataset representative of real inputs with expected outputs, (2) run prompt variants against this dataset, (3) measure metrics like accuracy, consistency, and format compliance, and (4) compare results statistically. This data-driven approach prevents subjective bias and ensures changes are genuinely improvements.

**Source:** Exam Guide §Task 4.12

---

### q123 — Task 4.5

**Scenario:** The pipeline extracts invoice fields (invoice number, date, total amount, line items, vendor name) from scanned PDF invoices with varying layouts and quality.

**Question:** A team is designing a structured data extraction pipeline that processes invoices from PDF documents. Which techniques help ensure consistent, reliable output from the extraction agent? (Select all that apply.)

**Options:**

A. **[✓]** Define all optional schema fields as nullable to prevent the model from fabricating values when source document information is genuinely absent

B. **[✓]** Enforce output structure and field types programmatically by using a JSON schema with tool_use rather than relying on prompt instructions alone

C. Rely on a single carefully worded system prompt instruction that describes the expected output format in sufficient detail for reliable compliance

D. Configure the model sampling temperature at 1.0 to encourage diverse output attempts and increase the probability of eventually producing correct structure

**Correct Answers:** A, B

**Explanation:** JSON schema enforcement via tool_use (option 1) guarantees the output structure matches downstream expectations. Nullable optional fields (option 0) prevent the model from fabricating values when information is absent from the source document. A single system prompt (option 2) is insufficient for reliable structured output. High temperature (option 3) reduces output consistency and increases hallucination risk.

**Source:** Exam Guide §Task 4.5

---

### q125 — Task 4.6

**Scenario:** The agent reviews 50+ pull requests per week. Reviews should catch real issues without overwhelming developers with minor stylistic preferences or false positives.

**Question:** A team is implementing a PR review agent and wants to maximize the value of AI-generated code reviews. Which criteria should guide the review scope to produce focused, actionable feedback? (Select all that apply.)

**Options:**

A. Flag every formatting choice and naming convention that differs from personal stylistic preference to ensure maximum consistency in the codebase

B. Comment on every line of code that could potentially benefit from any form of refactoring or structural improvement in any possible dimension

C. **[✓]** Identify API compatibility breaks and performance regressions introduced by the changes because these affect system stability and integration partners

D. **[✓]** Report all functional bugs and security vulnerabilities identified in the changed code because these issues directly impact correctness and safety

**Correct Answers:** C, D

**Explanation:** Effective PR reviews should focus on functional bugs and security issues (option 3) and API compatibility and performance regressions (option 2). These are high-value findings that directly impact code quality and system stability. Formatting preferences (option 0) should be enforced by automated linters, not reviewer comments. Flagging every potential refactoring (option 1) creates review fatigue and drowns out critical issues.

**Source:** Exam Guide §Task 4.6

---

## D5: Context Management & Reliability (19 questions)

### q052 — Task 5.1

**Scenario:** The agent's context window quickly fills with database results, leaving little room for reasoning and analysis. The agent starts losing coherence after 3-4 queries.

**Question:** A 'query_database' tool returns 100KB of results per query, including audit fields, metadata, and full row data. The agent uses 5 queries per conversation. What is the primary concern with this approach?

**Options:**

A. **[✓]** Excessive fields in tool results consume disproportionate context tokens, leaving insufficient space for model reasoning after multiple queries

B. The model is architecturally unable to parse or reason about structured database query results that exceed a certain number of columns

C. The API enforces a strict limit on the maximum number of tool invocations permitted per conversation session regardless of result size

D. The database tool is querying a slow backend, and the latency from each of the five queries is degrading the overall session responsiveness

**Correct Answer:** A

**Explanation:** Tool results with excessive fields consume tokens disproportionately, crowding out space for model reasoning and conversation history. With 100KB of results per query, 5 queries consume 500KB of the context window, leaving very little room for analysis. This is a classic context management problem where tool output size must be controlled to preserve room for reasoning.

**Source:** Exam Guide §Task 5.1

---

### q053 — Task 5.2

**Scenario:** The agent handles a multi-step payment workflow: validating the account, checking balance, processing payment, and sending confirmation. Each step is a separate tool call across multiple turns.

**Question:** A financial transactions agent processes payments across multiple conversation turns. How should critical transactional data that must persist across the entire session be managed?

**Options:**

A. **[✓]** Use a persistent structured case facts block maintained throughout the session to reliably anchor critical transactional data across all turns

B. Keep all transactional state embedded in the natural conversation history so the model can reference it organically across turns as needed

C. Resubmit the full transactional data object alongside every user message to ensure the model always has access to the complete state

D. Serialize the transaction state to a disk file after each step and re-read it at the start of every subsequent turn to restore context

**Correct Answer:** A

**Explanation:** A persistent structured case facts block ensures critical transactional data (customer ID, amount, account number, transaction status) is preserved accurately across turns. Conversation history can accumulate and change focus, but a structured facts block in the system prompt or as a dedicated context section maintains authoritative data that the model can always reference.

**Source:** Exam Guide §Task 5.2

---

### q054 — Task 5.3

**Scenario:** The customer is frustrated and explicitly demands human intervention. The agent has a tool to escalate cases to a human team.

**Question:** A customer tells a support agent I want to speak to a manager after receiving an automated response about a refund policy. The refund request is straightforward and falls within the agent authority to resolve autonomously. The agent has an escalation tool available for transferring cases to human agents. How should the agent handle this explicit customer request for human assistance?

**Options:**

A. **[✓]** Honor the explicit request for a human agent immediately by triggering the escalation workflow without attempting further automated resolution

B. Acknowledge the customer's frustration empathetically and offer to resolve the issue first, escalating only if the customer repeats the request

C. Explain to the customer that the automated system is fully capable of resolving this refund and complete the process autonomously as designed

D. Queue a callback from a human representative while continuing to process the refund autonomously to satisfy both the request and the outcome

**Correct Answer:** A

**Explanation:** An explicit customer demand for a human is a mandatory escalation trigger. The agent must not negotiate, ignore, or override this request. The correct behavior is to immediately trigger the escalation process, provide a clear handoff summary, and gracefully transition the customer to a human agent. Respecting this boundary is both a design requirement and a regulatory consideration in many jurisdictions.

**Source:** Exam Guide §Task 5.3

---

### q055 — Task 5.4

**Scenario:** The customer's request falls into a gap in the refund policy. The request seems reasonable, but no policy explicitly covers or prevents this scenario.

**Question:** A customer support agent encounters a situation where the refund policy does not cover the specific scenario the customer is requesting. The agent has the technical ability to issue a refund through its tools. What is the correct action?

**Options:**

A. Decline the request automatically since the absence of explicit policy coverage is functionally equivalent to a policy prohibition on the action

B. Draft a provisional policy interpretation that covers the edge case and apply it consistently to this and all similar future requests received

C. Exercise best professional judgment to make the most reasonable interpretation of the policy gap and issue the refund on the agent's own authority

D. **[✓]** Escalate the request to a human who has authority to handle policy exceptions rather than improvising a resolution within an undefined boundary

**Correct Answer:** D

**Explanation:** Policy exceptions and gaps require escalation, not improvisation. The agent must not create new policies or interpret reasonable-sounding requests as authorization. When there is no clear policy coverage, the correct action is to escalate to a human who has the authority to make exceptions or set new policy. Creating policies or improvising solutions outside defined boundaries is a serious design flaw leading to unpredictable behavior.

**Source:** Exam Guide §Task 5.4

---

### q056 — Task 5.5

**Scenario:** The payment processor could fail due to: insufficient funds, network timeout, invalid account, or daily limit exceeded. Each requires a different recovery action.

**Question:** A multi-agent refund processing system has a coordinator that routes to specialist agents. When a refund request fails at the payment processor, the payment agent returns 'Error: Operation failed.' How does this impact the coordinator's ability to recover?

**Options:**

A. The coordinator should move on to the next request when a payment fails since errors are common and re-attempting rarely produces different results

B. A plain error message contains enough context for an experienced coordinator to infer the correct recovery action from the surrounding circumstances

C. The coordinator can safely retry any failed operation without additional context because all payment errors are inherently transient and self-resolving

D. **[✓]** A generic error response conceals the failure category, making it impossible for the coordinator to determine the appropriate recovery action

**Correct Answer:** D

**Explanation:** Generic error responses ('Operation failed') hide the specific error context that the coordinator needs for intelligent recovery. Without knowing whether the error was transient (network timeout - retryable), validation (invalid account - fix input), or business (limit exceeded - escalate), the coordinator cannot determine the correct recovery action. Structured error responses with categories and details are essential for effective error recovery.

**Source:** Exam Guide §Task 5.5

---

### q057 — Task 5.6

**Scenario:** After 3 hours of intensive investigation with 50+ tool calls and message exchanges, the agent starts re-examining issues it already resolved and misses references to earlier conclusions.

**Question:** A long-running agent session has processed 50+ messages and the model is beginning to lose coherence, forget earlier findings, and repeat investigations already completed. What is the most effective mitigation?

**Options:**

A. Terminate the session and lose all accumulated investigation context, then start fresh with the user's goal restated from the very beginning

B. Reduce the scope of ongoing investigation to a smaller set of simpler tasks that fit more comfortably within the remaining available context

C. Ask the user to re-paste earlier context portions that the agent appears to have forgotten so investigation can continue without interruption

D. **[✓]** Write key findings, decisions, and active state to external scratchpad files that the agent can read back periodically to refresh its context

**Correct Answer:** D

**Explanation:** Context degradation is a known challenge in long-running sessions. Scratchpad files serve as external memory that persists key findings, decisions, and state outside the conversation context. The agent can write structured summaries to scratchpad files periodically and read them back to refresh context. This is more reliable than relying on the conversation history which may be compressed or partly lost.

**Source:** Exam Guide §Task 5.6

---

### q058 — Task 5.7

**Scenario:** The QA team reviews every single data transformation output. This is expensive and slow. They want to automate verification but cannot compromise on accuracy.

**Question:** A quality assurance pipeline uses an agent to validate data transformations. Currently, the pipeline performs 100% human review of all outputs. The team wants to reduce human effort while maintaining quality. What is the correct approach?

**Options:**

A. Begin by reducing review only for the lowest-priority data segments before progressively extending automation to higher-priority categories

B. Eliminate human review entirely and rely fully on the automated validation agent once it has been deployed and is operating in production

C. Immediately reduce human review sampling to ten percent of outputs since the automated system has already demonstrated general reliability

D. **[✓]** Validate accuracy at the data segment level first and reduce human review coverage only after establishing sufficient confidence thresholds

**Correct Answer:** D

**Explanation:** Before reducing review thresholds, you must first establish accuracy metrics through segment-level accuracy validation. Measure the agent's accuracy on different data segments, compare against human review, and only reduce review coverage after achieving confidence thresholds. Premature reduction without validation risks quality degradation that may go undetected.

**Source:** Exam Guide §Task 5.7

---

### q059 — Task 5.8

**Scenario:** Three research agents investigated different aspects of a security incident. The synthesis agent creates a unified timeline but cannot attribute findings to specific source agents for verification.

**Question:** A synthesis agent combines findings from multiple research subagents into a final report. During synthesis, the agent loses track of which finding came from which source, making verification impossible. What pattern prevents this?

**Options:**

A. Select findings exclusively from the most historically reliable research agent and exclude all other sources from the synthesis output entirely

B. **[✓]** Maintain explicit claim-source mappings that tag each synthesized finding back to its originating agent for traceability and verification

C. Consolidate all research into a single agent to eliminate the multi-source synthesis problem and simplify the provenance tracking requirements

D. Append all raw source documents in full to the final report so readers can independently cross-reference claims against their original sources

**Correct Answer:** B

**Explanation:** Claim-source mappings prevent attribution loss during synthesis. Each finding should be explicitly tagged with its source (e.g., 'Analysis by Agent A found: ...'). This enables verification, provides traceability, and allows the reader (or downstream processes) to assess the reliability of each claim. Without source mappings, synthesized reports lose provenance information critical for trust and verification.

**Source:** Exam Guide §Task 5.8

---

### q060 — Task 5.9

**Scenario:** The sources used different monitoring tools and measurement methodologies. Both findings may be valid for their specific context.

**Question:** A multi-agent research system produces a report where two subagents present conflicting data about the same metric from different monitoring tools and measurement periods. One source reports an average response time of two hundred milliseconds while another reports four hundred fifty milliseconds from a different tool. The synthesis agent must combine these findings into a coherent report. Which approach preserves accuracy and enables proper interpretation?

**Options:**

A. Flag the discrepancy as a potential data error and require both subagents to redo their analysis using identical tools and measurement windows

B. **[✓]** Annotate both conflicting values with source attribution and methodological context so readers can interpret each measurement appropriately

C. Calculate the arithmetic average of both reported values to produce a single compromise estimate acceptable to all downstream report consumers

D. Select the more conservative measurement value and discard the other to present a single internally consistent finding in the unified report

**Correct Answer:** B

**Explanation:** When sources conflict, the correct approach is to annotate both with attribution rather than arbitrarily selecting one value or computing a misleading average. The synthesis should present: 'Agent A (using DataDog) reports 200ms average; Agent B (using CloudWatch) reports 450ms average. This discrepancy may be due to different measurement periods or tooling differences.' This preserves the nuance and allows the reader to understand the context of each claim.

**Source:** Exam Guide §Task 5.9

---

### q112 — Task 5.10

**Scenario:** The application processes legal documents averaging 50K tokens each, plus tool results and conversation history. The total frequently approaches or exceeds the context limit.

**Question:** A developer is building an application that needs to stay within a 128K token context window. The agent regularly processes large documents and tool results. What strategy should be used to manage context window limits?

**Options:**

A. Upgrade to the highest available context window tier so that document size is never a binding constraint on agent session capacity or quality

B. Divide all inputs into fixed-size chunks of equal token length and process each chunk independently without reference to document structure

C. **[✓]** Estimate token counts proactively, prioritize critical information in a structured block, and prune verbose content to stay within context limits

D. Allow the API to handle context overflow automatically through built-in truncation, accepting that some oldest content may be silently discarded

**Correct Answer:** C

**Explanation:** Context window limits and management require proactive planning: (1) estimate token counts for documents, tool results, and conversation history, (2) prioritize critical information in a structured facts block, (3) summarize verbose content, and (4) prune low-value history. Blind truncation of oldest content may lose critical information that the model still needs.

**Source:** Exam Guide §Task 5.10

---

### q113 — Task 5.11

**Scenario:** The application dynamically constructs prompts with variable-length inputs. Exceeding the context window causes truncation and degraded responses.

**Question:** An architect needs to estimate how many tokens a given text input will consume before making an API call. What is the best approach for token counting and estimation?

**Options:**

A. Make the API call first and then check the input_tokens field in the usage response object to determine actual consumption after the fact

B. Use a rough character-based heuristic by counting total characters and dividing by four as an acceptable approximation for token estimation

C. Estimate token counts using a word-per-token ratio of 1.3 words per token as a portable approximation suitable for general text content

D. **[✓]** Use a tokenizer library that matches the model's own tokenizer to produce accurate pre-call token count estimates for dynamic prompt construction

**Correct Answer:** D

**Explanation:** Token counting and estimation should use a tokenizer library that matches the model's tokenizer (e.g., claude-tokenizer or Anthropic's token counting API). This provides accurate pre-call estimates, enabling proactive context management. Character-based heuristics or word-based estimates can be inaccurate, especially for code or structured data. Post-hoc checking is too late for prevention.

**Source:** Exam Guide §Task 5.11

---

### q114 — Task 5.12

**Scenario:** The session has investigated three separate issues, each with its own findings, decisions, and action items. All three may need to be referenced again.

**Question:** A long-running agent session has accumulated 100+ messages covering multiple topics. The context window is nearly full. How should the conversation be summarized to preserve essential information?

**Options:**

A. Delete the oldest half of the conversation and retain only the most recent messages to free context space for continued investigation activity

B. Export the complete session history to a file and begin a fresh session with only the new task context provided to the model at the start

C. **[✓]** Generate thread-specific summaries for each investigation topic that preserve key findings, decisions, and outstanding action items per thread

D. Ask the model to generate a single brief paragraph summarizing all prior session activity to replace the full history before continuing

**Correct Answer:** C

**Explanation:** Conversation summarization strategies should produce topic-specific summaries rather than generic compression. Each thread of investigation should be condensed into its key findings, decisions, and action items. This preserves the structured knowledge while removing verbose tool outputs and redundant exchanges. Single generic summaries lose too much context, and simple deletion risks losing important information.

**Source:** Exam Guide §Task 5.12

---

### q115 — Task 5.13

**Scenario:** The model processes 80K token documents. Facts from the first 10K and last 10K tokens are reliably extracted, but facts from the middle 60K tokens are frequently missed or incorrectly recalled.

**Question:** A QA team notices that when processing long documents, the model tends to accurately recall information from the beginning and end of the context window but misses details from the middle sections. What phenomenon is this?

**Options:**

A. **[✓]** The lost-in-the-middle effect describes the observed phenomenon where models show reduced recall accuracy for information at mid-context positions

B. This behavior occurs because documents with multiple distinct topics exceed the model's ability to maintain separate attention streams simultaneously

C. This pattern indicates that the model is fundamentally incapable of processing documents that exceed a certain length with acceptable accuracy

D. This pattern represents a statistical anomaly in the random sampling process that will self-correct as more documents are processed over time

**Correct Answer:** A

**Explanation:** The 'lost in the middle' effect is a well-documented phenomenon where language models show reduced accuracy for information positioned in the middle of the context window, compared to information at the beginning (primacy effect) and end (recency effect). Mitigations include: placing critical information at the start or end, using structured formats, and performing targeted retrieval rather than relying on the model to scan the full context.

**Source:** Exam Guide §Task 5.13

---

### q116 — Task 5.14

**Scenario:** The agent ran 15 database queries early in the session, each returning 20KB of results. The current task only needs to reference the conclusions drawn from those queries, not the raw data.

**Question:** A developer's agent session has accumulated large amounts of verbose tool output that is no longer needed for current reasoning. What context pruning technique should be used?

**Options:**

A. Retain all tool results indefinitely in the active context window so they remain available for reference if earlier findings become relevant again

B. Delete the oldest raw tool outputs directly from the conversation history without first extracting or preserving the analytical conclusions drawn

C. Request a context window size upgrade from the API provider so that all historical tool outputs can be retained without any pruning required

D. **[✓]** Prune verbose tool output from older turns after extracting key insights, replacing raw results with concise summaries of the conclusions drawn

**Correct Answer:** D

**Explanation:** Context pruning techniques should remove verbose raw data after it has served its purpose, replacing it with concise summaries of the conclusions drawn. This frees context window space while preserving the insights the model needs for ongoing reasoning. Simple deletion without summarization loses valuable conclusions, while retaining all raw data wastes precious context space.

**Source:** Exam Guide §Task 5.14

---

### q117 — Task 5.15

**Scenario:** The system has 5 research agents producing analysis. A synthesis agent combines findings. Downstream consumers need to verify the source of each claim.

**Question:** A multi-agent research system must track where each piece of information came from to enable verification and auditing. What architectural pattern supports this?

**Options:**

A. Accept the synthesis agent's output as authoritative since it is the designated responsible component for producing accurate unified findings

B. Include complete raw outputs from all research agents in the final report body so readers can independently locate and trace each claim's origin

C. **[✓]** Tag each finding throughout the pipeline with its source agent, timestamp, methodology, and confidence level to maintain full provenance metadata

D. Route all synthesized findings through a dedicated coordinator review step that validates accuracy before passing results to downstream consumers

**Correct Answer:** C

**Explanation:** Information provenance and source tracking requires each finding to be tagged with metadata throughout the pipeline: originating agent, timestamp, methodology used, and confidence level. This enables downstream consumers to verify claims, assess reliability, and trace information back to its origin. Without provenance metadata, synthesized information loses its audit trail and cannot be effectively verified.

**Source:** Exam Guide §Task 5.15

---

### q118 — Task 5.16

**Scenario:** The system processes thousands of tickets daily. Failures, timeouts, and unexpected inputs are common. The system must handle these gracefully without data loss or inconsistent state.

**Question:** A production system uses an AI agent to process customer support tickets. What patterns should be implemented to ensure reliable operation in production?

**Options:**

A. Assume the model and underlying tools will handle most requests correctly and plan to investigate only when an anomalous failure rate is detected

B. **[✓]** Implement retry logic with exponential backoff, circuit breakers for failing services, and dead-letter queues for unprocessable tickets

C. Process all tickets through a strictly sequential single-worker pipeline to simplify failure handling and eliminate concurrency-related edge cases

D. Assign a human operator to monitor the system dashboard continuously and initiate manual restarts in response to observed failure incidents

**Correct Answer:** B

**Explanation:** Reliability patterns for production systems include: (1) retry with backoff for transient failures, (2) idempotent operations to safely retry without side effects, (3) circuit breakers to stop hammering failing services, (4) dead-letter queues for items that cannot be processed, and (5) comprehensive logging for debugging. Production AI systems need the same reliability infrastructure as traditional production services.

**Source:** Exam Guide §Task 5.16

---

### q119 — Task 5.17

**Scenario:** The API experiences occasional outages lasting 5-30 minutes. Orders must still be accepted and queued for processing, even if AI analysis is temporarily unavailable.

**Question:** A critical AI-powered order processing system needs to handle the case where the underlying LLM API is unavailable. What fallback and degradation strategy is most appropriate?

**Options:**

A. Continue issuing API calls during outages indefinitely since most transient errors resolve quickly without requiring any explicit queueing logic

B. Switch the entire order processing workflow to a fully manual human-operated process for the duration of every API outage period encountered

C. Reject all incoming orders during API outages and display an error message asking customers to retry submission when the service is restored

D. **[✓]** Queue all orders received during outages with a pending-review status and process the accumulated queue automatically once API access recovers

**Correct Answer:** D

**Explanation:** Fallback and degradation strategies should maintain system availability: (1) queue requests during outages with clear status tracking, (2) process queued items when service recovers, (3) notify customers of potential delays, (4) optionally use a simpler fallback model if available. This ensures the system remains functional even when the primary AI service is unavailable, maintaining business continuity.

**Source:** Exam Guide §Task 5.17

---

### q120 — Task 5.18

**Scenario:** Loan applications over $50,000 must be reviewed and approved by a human underwriter before the loan can be finalized. The AI handles all applications up to $50,000 autonomously.

**Question:** A financial services company uses an AI agent to process loan applications. Certain high-value applications require mandatory human approval before finalization. What workflow pattern supports this?

**Options:**

A. Allow the AI to process all loan applications autonomously and conduct human audits of completed decisions in periodic batch review cycles

B. Subject every loan application to mandatory human review regardless of amount to maintain uniform oversight and eliminate autonomous decisions

C. Trust the AI to identify which individual applications warrant human escalation based on its own risk assessment and uncertainty signals

D. **[✓]** Use a human-in-the-loop workflow that routes applications above the fifty-thousand-dollar threshold to human underwriters before finalization

**Correct Answer:** D

**Explanation:** Human-in-the-loop review workflows implement a threshold-based escalation: below the threshold ($50K), the AI processes autonomously with appropriate speed and efficiency. At or above the threshold, the AI prepares a comprehensive analysis package and routes it to a human for final decision. This balances efficiency for routine cases with appropriate oversight for high-risk decisions. Leaving the escalation decision to the AI's judgment is unreliable for regulatory compliance.

**Source:** Exam Guide §Task 5.18

---

### q124 — Task 5.19

**Scenario:** The application processes customer support requests using Claude API. The API occasionally returns 429 (rate limit) and 503 (service unavailable) errors lasting 10-60 seconds.

**Question:** An AI-powered application handles customer-facing interactions and experiences occasional API failures. Which patterns are appropriate for maintaining system reliability during transient failures? (Select all that apply.)

**Options:**

A. **[✓]** Deploy circuit breaker patterns that temporarily halt calls to a failing endpoint to allow recovery time before gradually resuming traffic

B. **[✓]** Implement exponential backoff retry logic that progressively increases delay between attempts when transient 429 or 503 errors are received

C. Surface a generic timeout error message to customers and permanently discard any API request that fails on its initial submission attempt

D. Escalate every individual API error to a human operator immediately regardless of error type or whether a retry would likely succeed

**Correct Answers:** A, B

**Explanation:** Exponential backoff retry (option 1) is the standard pattern for transient errors, starting with short delays and increasing between attempts. Circuit breakers (option 0) prevent cascading failures by stopping calls to a failing endpoint, allowing it time to recover, then gradually resuming traffic. Discarding requests (option 2) causes data loss. Escalating every error (option 3) is impractical and floods operators with non-critical alerts.

**Source:** Exam Guide §Task 5.19

---

