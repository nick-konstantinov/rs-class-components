import './About.css';

function About() {
  return (
    <section className="about">
      <h2 className="about__title">About</h2>

      <p className="about__intro">
        Hi! I'm <strong>Nick Konstantinov</strong>, a student of the{' '}
        <a
          className="about__link"
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noreferrer"
        >
          Rolling Scopes School: React 2026Q2
        </a>{' '}
        course. This Pokemon search app is built as Task 3 of the React module.
      </p>

      <h3 className="about__subtitle">Contacts</h3>
      <ul className="about__list">
        <li>
          GitHub:{' '}
          <a
            className="about__link"
            href="https://github.com/nick-konstantinov"
            target="_blank"
            rel="noreferrer"
          >
            @nick-konstantinov
          </a>
        </li>
        <li>
          Email:{' '}
          <a className="about__link" href="mailto:nick.konstantinov.job@gmail.com">
            nick.konstantinov.job@gmail.com
          </a>
        </li>
      </ul>

      <h3 className="about__subtitle">Course materials</h3>
      <p>
        Task descriptions and resources:{' '}
        <a
          className="about__link"
          href="https://github.com/rolling-scopes-school/tasks/blob/master/react/README.md"
          target="_blank"
          rel="noreferrer"
        >
          rolling-scopes-school/tasks
        </a>
      </p>
    </section>
  );
}

export default About;
