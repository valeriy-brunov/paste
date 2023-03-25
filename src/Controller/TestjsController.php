<?php
declare(strict_types=1);

namespace Paste\Controller;

use Paste\Controller\AppController;

/**
 * Testjs Controller
 *
 * @method \Paste\Model\Entity\Testj[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class TestjsController extends AppController
{
    /**
     * Index method
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function index()
    {
        $this->viewBuilder()->setLayout('WebComponent.ajax');
    }
}