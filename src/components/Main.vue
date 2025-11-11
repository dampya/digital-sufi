<style src="./../styles/main/main.css" scoped></style>

<template>
  <div class="page">
    <main class="content">
      <h1>Om Dighe</h1>
      <h3> 
        <a href="https://github.com/dampya" target="_blank">GitHub</a> | 
        <a href="https://linkedin.com/in/om-dighe-1a017a17b/" target="_blank">LinkedIn</a>
      </h3>
      <br />
      <section>
        <h2>Education</h2>
        <h3>
          <strong>Computer Science</strong> — Dublin City University (09/2021 – 10/2025)
        </h3>
        <ul>
          <li>Graduated with 2nd Class Honours</li>
          <li>Studied algorithms, data structures, networks, operating systems, and OOP</li>
          <li>Experience with machine learning model training</li>
          <li>Proficient in modern frameworks, languages, paradigms, and DevOps</li>
        </ul>
      </section>
      <br />
      <section>
        <h2>Professional Experience</h2>
        <ul>
          <li>
            <strong>Tenoris Analytics</strong> — Co-Founder / CTO (06/2025 – Present, Toulouse, France)
            <ul>
              <li>Developing TalentGrid, connecting students, universities, and employers via AI ePortfolios</li>
              <li>Full-stack features with AWS backend, vector search for candidate-job matching</li>
            </ul>
          </li>
          <li>
            <strong>Ernst & Young</strong> — Tax and Technology Work Placement (06/2025 – 07/2025, Dublin, Ireland)
            <ul>
              <li>Automated tax tools using UiPath, Power Automate, Task Scheduler</li>
              <li>Gained experience in RPA and large-scale process improvement</li>
            </ul>
          </li>
          <li>
            <strong>Aviva Insurance</strong> — Software Engineering Intern (03/2024 – 09/2024, Dublin, Ireland)
            <ul>
              <li>Refactored Jenkins pipelines into smaller libraries for modularity</li>
              <li>Worked on unit and regression testing, organized IT career events</li>
            </ul>
          </li>
          <li>
            <strong>TakeStock</strong> — Stock Taker (11/2024 – 04/2025, Dublin, Ireland)
            <ul>
              <li>Conducted inventory audits using barcode scanners for accurate stock tracking</li>
            </ul>
          </li>
        </ul>
      </section>
      <br />
      <section>
        <h2>Projects</h2>
        <ul>
          <li>
            <strong>OneSmallStep</strong> — A Rust Emulator for the Apollo 11 Guidance Computer
            <ul>
              <li>Cycle-accurate AGC emulator in Rust, 15-bit architecture, 2kb RAM, 72kb ROM</li>
              <li>Integrated peripherals like DSKY and logged register states for visualization</li>
              <li>Complementary tooling in Kotlin for data visualization and automated testing</li>              
            </ul>
          </li>
          <li>
            <strong>WebPeekAI</strong> — Integrated Chrome Extension to Summarize Websites
            <ul>
              <li>Uses third-party AI API for summaries and images in a hover popup</li>
              <li>Supports 50+ languages and theme customization</li>
            </ul>
          </li>
          <li>
            <strong>PoemsAI</strong> — Bi-LSTM Model for Sentiment Analysis of Poems
            <ul>
              <li>Achieved 86% accuracy using Hugging Face dataset</li>
              <li>Preprocessing and model evaluation done with Python and TensorFlow/Keras</li>
            </ul>
          </li>
          <li>
            <strong>MyShell</strong> — Command Line Interpreter in C
            <ul>
              <li>Executes commands from input/files with 20+ built-in commands</li>
              <li>Includes directory navigation, environment handling, interactive shell</li>
            </ul>
          </li>
        </ul>
      </section>
      <br />
      <section>
        <h2>Organisations</h2>
        <ul>
          <li>
            <strong>Redbrick - DCU's Computing Society</strong> — Secretary (03/2022 – 02/2023)
            <ul>
              <li>Composed newsletters, organized events, served as committee liaison</li>
            </ul>
          </li>
          <li>
            <strong>Black Students and Students of Colour Advisory Group</strong> — Committee Member (10/2021 – 10/2022)
            <ul>
              <li>Promoted inclusivity, organized events, planned week-long Asian culture celebration</li>
            </ul>
          </li>
          <li>
            <strong>DCU Chess and Checkers Club</strong> — Equipment Manager & First Year Representative (10/2021 – 09/2023)
            <ul>
              <li>Managed chess equipment, organized events, liaison for first-year members</li>
            </ul>
          </li>
        </ul>
      </section>
      <br />
      <section>
        <h2>Awards</h2>
        <ul>
          <li>
            <strong>EY Sustainability Challenge</strong> — Ernst & Young, 05/2025
            <ul>
              <li>Finalist for EcoCharge smart energy-saving system</li>
              <li>Earned work placement opportunity at EY</li>
            </ul>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: "Main",
};
</script>

